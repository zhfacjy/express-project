const _ = require('lodash');
const mongo = require('../utils/mongo-util');

const Collect = mongo.getModule('collect');
const Att = mongo.getModule('att');
const Dict = mongo.getModule('dict');
const PostAndAtt = mongo.getModule('postAndAtt');
const PostAndTag = mongo.getModule('postAndTag');
const User = mongo.getModule('user');
const PostWork = mongo.getModule('postWorks');
const PostInfo = mongo.getModule('postInfo');
const AreaCode = mongo.getModule('areaCode');
const UserAndRequest = mongo.getModule('userAndRequest');

module.exports.addCollect = async params => {
  const collect = new Collect(params);
  return collect.save();
};

module.exports.removeCollect = async (post_id, user_id, type) => {
  return Collect.remove({post_id, user_id, type});
};

module.exports.getCollectList = async (user_id, type, skip, take) => {
  const posts = await Collect.find({user_id: user_id, type}, {post_id: 1});
  const postIds = _.map(posts, 'post_id');
  const fp = {delete_flag: 0, _id: {$in: postIds}};
  if (type === 1) {
    const rl = await PostWork.find(fp).skip(skip).limit(take).sort({create_at: -1});
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
      delete x.role_id;
      delete x.create_by;
      return x;
    }));
    const total = await PostWork.countDocuments(fp);
    return {
      content: result,
      totalElements: total
    };
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

module.exports.getPostList = async (user_id, type, skip, take) => {
  const fp = {delete_flag: 0, create_by: user_id};
  if (type === 1) {
    const rl = await PostWork.find(fp).skip(skip).limit(take).sort({create_at: -1});
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
      delete x.role_id;
      delete x.create_by;
      return x;
    }));
    const total = await PostWork.countDocuments(fp);
    return {
      content: result,
      totalElements: total
    };
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

module.exports.receiver = async (user_id, skip, take) => {
  const rl = await UserAndRequest.find(
    {user_id: user_id}
  ).skip(skip).limit(take).sort({create_at: -1});
  const postIds = _.map(rl, 'post_id');
  const postInfos = await PostInfo.find({_id: {$in: postIds}});
  const result = await Promise.all(_.map(postInfos, async p => {
    const x = JSON.parse(JSON.stringify(p));
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
  const total = await UserAndRequest.countDocuments({user_id: user_id});
  return {
    content: result,
    totalElements: total
  };
};
