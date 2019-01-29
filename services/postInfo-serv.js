const _ = require('lodash');
const mongo = require('../utils/mongo-util');

const PostInfo = mongo.getModule('postInfo');
const Dict = mongo.getModule('dict');
const Att = mongo.getModule('att');
const PostAndAtt = mongo.getModule('postAndAtt');
const PostAndTag = mongo.getModule('postAndTag');
const UserAndRequest = mongo.getModule('userAndRequest');
const User = mongo.getModule('user');
const AreaCode = mongo.getModule('areaCode');

module.exports.findAll = async (params, skip, take, same_city) => {
  const fp = {delete_flag: 0, has_request: 0};
  if (params.sex !== null) {
    fp.create_by_sex = params.sex;
  }
  if (params.role_id) {
    fp.role_id = params.role_id;
  }
  if (params.city_code) {
    fp.city_code = params.city_code;
  } else if (same_city) {
    const user = await User.findById(params.uid);
    fp.city_code = user.city_code;
    fp.create_by = {$ne: params.uid};
  }
  const rl = await PostInfo.find(fp).skip(skip).limit(take).sort({create_at: -1});
  const result = await Promise.all(_.map(rl, async r => {
    const x = JSON.parse(JSON.stringify(r));
    const u = await User.findById(x.create_by);
    x.username = u.username;
    x.sex = u.sex;
    const role = await Dict.findOne({dict_code: u.role_id, type: 2}, {name: 1});
    x.user_role = role.name;
    const att = await Att.findOne({_id: u.avatar}, {path: 1});
    x.avatar_path = att.path;
    const area = await AreaCode.findOne({
      id: x.city_code.substr(2, 2),
      parent_id: x.city_code.substr(0, 2)
    });
    x.city_name = area.name;
    const tags = await PostAndTag.find({post_id: x._id, type: 2}, {tag_id: 1});
    const tagIds = _.map(tags, 'tag_id');
    const tagNames = await Dict.find({_id: {$in: tagIds}}, {name: 1});
    x.tags = _.map(tagNames, 'name');
    const atts = await PostAndAtt.find({post_id: x._id, type: 2}, {att_id: 1});
    const attIds = _.map(atts, 'att_id');
    const attPaths = await Att.find({_id: {$in: attIds}}, {path: 1});
    x.atts = _.map(attPaths, 'path');
    delete x.city_code;
    delete x.role_id;
    delete x.create_by;
    return x;
  }));
  const total = await PostInfo.countDocuments(fp);
  return {
    content: result,
    totalElements: total
  };
};

module.exports.save = async params => {
  const id = params.post_info.id;
  delete params.post_info.id;
  const session = await mongo.getSession();
  session.startTransaction();
  const user = await User.findById(params.post_info.create_by);
  params.post_info.create_by_sex = user.sex;
  try {
    const opts = { session, new: true };
    // 更新
    if (id) {
      await PostInfo.findOneAndUpdate({_id: id}, params.post_info, opts);
      const atts = await PostAndAtt.find({post_id: id, type: 2}, {att_id: 1, _id: 0});
      const att_ids = _.map(atts, 'att_id');
      await Promise.all([
        Att.deleteMany({_id: {$in: att_ids}}).session(session),
        PostAndAtt.remove({post_id: id, type: 2}).session(session),
        PostAndTag.remove({post_id: id, type: 2}).session(session)
      ]);
      await Promise.all(_.map(params.tags, async x => {
        const postAndTag = new PostAndTag({
          tag_id: x,
          post_id: id,
          type: 2
        });
        await postAndTag.save(opts);
      }));
      await Promise.all(_.map(params.atts, async x => {
        const att = new Att({path: x});
        const a = await att.save(opts);
        const postAndAtt = new PostAndAtt({
          att_id: a._id,
          post_id: id,
          type: 2
        });
        await postAndAtt.save(opts);
      }));
    } else {
      // 新增
      const postInfo = new PostInfo(params.post_info);
      const p = await postInfo.save(opts);
      await Promise.all(_.map(params.tags, async x => {
        const postAndTag = new PostAndTag({
          tag_id: x,
          post_id: p._id,
          type: 2
        });
        await postAndTag.save(opts);
      }));
      await Promise.all(_.map(params.atts, async x => {
        const att = new Att({path: x});
        const a = await att.save(opts);
        const postAndAtt = new PostAndAtt({
          att_id: a._id,
          post_id: p._id,
          type: 2
        });
        await postAndAtt.save(opts);
      }));
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports.delete = async (uid, info_id) => {
  return PostInfo.findOneAndUpdate({_id: info_id, create_by: uid}, {delete_flag: 1});
};

module.exports.addRequest = async params => {
  const userAndRequest = new UserAndRequest(params);
  await userAndRequest.save();
  await PostInfo.findOneAndUpdate({_id: params.post_id}, {has_request: 1});
};
