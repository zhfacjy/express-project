const _ = require('lodash');
const mongo = require('../utils/mongo-util');

const PostWork = mongo.getModule('postWorks');
const Dict = mongo.getModule('dict');
const Att = mongo.getModule('att');
const PostAndAtt = mongo.getModule('postAndAtt');
const PostAndTag = mongo.getModule('postAndTag');
const User = mongo.getModule('user');
const Collect = mongo.getModule('collect');

module.exports.findAll = async (skip, take, login_id) => {
  const rl = await PostWork.find({delete_flag: 0}).skip(skip).limit(take).sort({create_at: -1});
  const result = await Promise.all(_.map(rl, async r => {
    const x = JSON.parse(JSON.stringify(r));
    const u = await User.findById(x.create_by);
    x.username = u.username;
    x.sex = u.sex;
    const role = await Dict.findOne({dict_code: u.role_id, type: 2}, {name: 1});
    x.user_role = role.name;
    const att = await Att.findOne({_id: u.avatar}, {path: 1});
    x.avatar_path = att.path;
    const tags = await PostAndTag.find({post_id: x._id, type: 1}, {tag_id: 1});
    const tagIds = _.map(tags, 'tag_id');
    const tagNames = await Dict.find({_id: {$in: tagIds}}, {name: 1});
    x.tags = _.map(tagNames, 'name');
    const atts = await PostAndAtt.find({post_id: x._id, type: 1}, {att_id: 1});
    const attIds = _.map(atts, 'att_id');
    const attPaths = await Att.find({_id: {$in: attIds}}, {path: 1});
    x.atts = _.map(attPaths, 'path');
    // 作品对象
    const worksRole = await Dict.findOne({dict_code: x.role_id, type: 2}, {name: 1});
    x.works_role = worksRole.name;
    x.has_collect = 0;
    if (login_id) {
      const c = await Collect.countDocuments({user_id: login_id, post_id: x._id});
      x.has_collect = c;
    }
    return x;
  }));
  const total = await PostWork.countDocuments({delete_flag: 0});
  return {
    content: result,
    totalElements: total
  };
};

module.exports.save = async params => {
  const id = params.post_works.id;
  delete params.post_works.id;
  const session = await mongo.getSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    // 更新
    if (id) {
      await PostWork.findOneAndUpdate({_id: id}, params.post_works, opts);
      const atts = await PostAndAtt.find({post_id: id, type: 1}, {att_id: 1, _id: 0});
      const att_ids = _.map(atts, 'att_id');
      await Promise.all([
        Att.deleteMany({_id: {$in: att_ids}}).session(session),
        PostAndAtt.remove({post_id: id, type: 1}).session(session),
        PostAndTag.remove({post_id: id, type: 1}).session(session)
      ]);
      await Promise.all(_.map(params.tags, async x => {
        const postAndTag = new PostAndTag({
          tag_id: x,
          post_id: id,
          type: 1
        });
        await postAndTag.save(opts);
      }));
      await Promise.all(_.map(params.atts, async x => {
        const att = new Att({path: x});
        const a = await att.save(opts);
        const postAndAtt = new PostAndAtt({
          att_id: a._id,
          post_id: id,
          type: 1
        });
        await postAndAtt.save(opts);
      }));
    } else {
      // 新增
      const postWork = new PostWork(params.post_works);
      const p = await postWork.save(opts);
      await Promise.all(_.map(params.tags, async x => {
        const postAndTag = new PostAndTag({
          tag_id: x,
          post_id: p._id,
          type: 1
        });
        await postAndTag.save(opts);
      }));
      await Promise.all(_.map(params.atts, async x => {
        const att = new Att({path: x});
        const a = await att.save(opts);
        const postAndAtt = new PostAndAtt({
          att_id: a._id,
          post_id: p._id,
          type: 1
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

module.exports.delete = async (uid, works_id) => {
  return PostWork.findOneAndUpdate({_id: works_id, create_by: uid}, {delete_flag: 1});
};
