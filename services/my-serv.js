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

module.exports.getCollectList = async user_id => {
  const collects = await Collect.find({
    user_id: user_id, delete_flag: 0
  }, {post_id: 1, type: 1}).sort({create_at: -1});
  const result = await Promise.all(_.map(collects, async c => {
    if (c.type === 1) {
      const p = await PostWork.findById(c.post_id);
      const x = JSON.parse(JSON.stringify(p));
      const u = await User.findById(x.create_by);
      x.create_at = new Date(x.create_at - 24 * 60 * 60 * 1000).toLocaleString();
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
      x.post_type = 1;
      // 作品对象
      const worksRole = await Dict.findOne({dict_code: x.role_id, type: 2}, {name: 1});
      x.works_role = worksRole.name;
      return x;
    }
    const p = await PostInfo.findById(c.post_id);
    const x = JSON.parse(JSON.stringify(p));
    const u = await User.findById(x.create_by);
    x.create_at = new Date(x.create_at - 24 * 60 * 60 * 1000).toLocaleString();
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
    // 约拍对象
    const requestRole = await Dict.findOne({dict_code: x.role_id, type: 2}, {name: 1});
    x.request_role = requestRole.name;
    x.post_type = 2;
    return x;
  }));
  return result;
};

module.exports.getPostList = async (user_id, type) => {
  const fp = {delete_flag: 0, create_by: user_id};
  if (type === 1) {
    const rl = await PostWork.find(fp).sort({create_at: -1});
    const result = await Promise.all(_.map(rl, async r => {
      const x = JSON.parse(JSON.stringify(r));
      const u = await User.findById(x.create_by);
      x.create_at = new Date(x.create_at - 24 * 60 * 60 * 1000).toLocaleString();
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
      return x;
    }));
    return result;
  }
  const rl = await PostInfo.find(fp).sort({create_at: -1});
  const result = await Promise.all(_.map(rl, async r => {
    const x = JSON.parse(JSON.stringify(r));
    const u = await User.findById(x.create_by);
    x.create_at = new Date(x.create_at - 24 * 60 * 60 * 1000).toLocaleString();
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
    // 约拍对象
    const requestRole = await Dict.findOne({dict_code: x.role_id, type: 2}, {name: 1});
    x.request_role = requestRole.name;
    const uq = await UserAndRequest.find({post_id: x._id}, {create_by: 1});
    const rquids = _.map(uq, 'create_by');
    const users = await User.find({_id: {$in: rquids}}, {avatar: 1});
    const avatars = _.map(users, 'avatar');
    const avatar_atts = await Att.find({_id: {$in: avatars}}, {path: 1});
    x.request_avatars = _.map(avatar_atts, 'path');
    return x;
  }));
  return result;
};

// sendOrReceiver 1 是send  0 是 receiver
module.exports.sendOrReceiver = async (user_id, sendOrReceiver) => {
  const fp = {};
  if (sendOrReceiver) {
    fp.create_by = user_id;
  } else {
    fp.user_id = user_id;
  }
  const rl = await UserAndRequest.find(fp).sort({create_at: -1});
  const postIds = _.map(rl, 'post_id');
  const postInfos = await PostInfo.find({_id: {$in: postIds}});
  const pis = JSON.parse(JSON.stringify(postInfos));
  const result = await Promise.all(_.map(rl, async r => {
    const x = JSON.parse(JSON.stringify(r));
    const u = await User.findById(x.create_by);
    x.create_at = new Date(x.create_at - 24 * 60 * 60 * 1000).toLocaleString();
    x.username = u.username;
    x.sex = u.sex;
    const role = await Dict.findOne({dict_code: u.role_id, type: 2}, {name: 1});
    x.user_role = role.name;
    const att = await Att.findOne({_id: u.avatar}, {path: 1});
    x.avatar_path = att.path;
    const area = await AreaCode.findOne({
      id: u.city_code.substr(2, 2),
      parent_id: u.city_code.substr(0, 2)
    });
    x.city_name = area.name;
    // 约拍实体
    const has = _.find(pis, p => p._id === x.post_id);
    const user = await User.findById(has.create_by);
    has.create_at = new Date(has.create_at - 24 * 60 * 60 * 1000).toLocaleString();
    has.username = user.username;
    has.sex = user.sex;
    const role2 = await Dict.findOne({dict_code: user.role_id, type: 2}, {name: 1});
    has.user_role = role2.name;
    const att2 = await Att.findOne({_id: user.avatar}, {path: 1});
    has.avatar_path = att2.path;
    const area2 = await AreaCode.findOne({
      id: has.city_code.substr(2, 2),
      parent_id: has.city_code.substr(0, 2)
    });
    has.city_name = area2.name;
    const tags = await PostAndTag.find({post_id: has._id, type: 2}, {tag_id: 1});
    const tagIds = _.map(tags, 'tag_id');
    const tagNames = await Dict.find({_id: {$in: tagIds}}, {name: 1});
    has.tags = _.map(tagNames, 'name');
    const atts = await PostAndAtt.find({post_id: has._id, type: 2}, {att_id: 1});
    const attIds = _.map(atts, 'att_id');
    const attPaths = await Att.find({_id: {$in: attIds}}, {path: 1});
    has.atts = _.map(attPaths, 'path');
    // 约拍对象
    const requestRole = await Dict.findOne({dict_code: has.role_id, type: 2}, {name: 1});
    has.request_role = requestRole.name;
    delete has.city_code;
    const c = await Collect.countDocuments({user_id: user_id, post_id: has._id});
    has.has_collect = c;
    const uq = await UserAndRequest.find({post_id: has._id}, {create_by: 1});
    const rquids = _.map(uq, 'create_by');
    const users = await User.find({_id: {$in: rquids}}, {avatar: 1});
    const avatars = _.map(users, 'avatar');
    const avatar_atts = await Att.find({_id: {$in: avatars}}, {path: 1});
    has.request_avatars = _.map(avatar_atts, 'path');

    x.post_info = has;
    return x;
  }));
  if (!sendOrReceiver) await UserAndRequest.updateMany(fp, {has_read: 1});
  return result;
};

module.exports.hasCollect = async (uid, post_id, type) => {
  return Collect.countDocuments({user_id: uid, post_id: post_id, type: type});
};

module.exports.hasNotRead = async uid => {
  return UserAndRequest.countDocuments({user_id: uid, has_read: 0});
};
