const crypto = require('crypto');
const config = require('../config');
const mongo = require('../utils/mongo-util');

const User = mongo.getModule('user');
const Att = mongo.getModule('att');
const Follow = mongo.getModule('follow');
const City = mongo.getModule('areaCode');
const Info = mongo.getModule('postInfo');
const Dict = mongo.getModule('dict');

module.exports.register = async params => {
  const hasExist = await User.countDocuments({mobile: params.mobile});
  if (hasExist !== 0) return {code: 401, message: '该电话号码已存在！'};
  const avatar_path = params.avatar;
  const session = await mongo.getSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const att = new Att({path: avatar_path});
    const a = await att.save(opts);
    params.avatar = a._id;
    const user = new User(params);
    const b = await user.save(opts);
    // 加密
    const saltPassword = `${params.password}:${b._id}${config.salt}`;
    const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
    await User.findOneAndUpdate({_id: b._id}, {password: ps}, opts);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  return {code: 0, data: null};
};

module.exports.hasExistMob = async mobile => {
  const hasExist = await User.countDocuments({mobile: mobile});
  if (hasExist !== 0) return {code: 401, message: '该电话号码已存在！'};
  return {code: 0, data: null};
};

module.exports.modify = async (params, uid) => {
  const avatar = await User.findById(uid, {avatar: 1, mobile: 1});
  if (params.mobile !== avatar.mobile) {
    const hasExist = await User.countDocuments({mobile: params.mobile});
    if (hasExist !== 0) return {code: 401, message: '该电话号码已存在！'};
  }
  const att_id = avatar.avatar; // 删除用
  const avatar_path = params.avatar;
  // 加密
  const saltPassword = `${params.password}:${uid}${config.salt}`;
  const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
  params.password = ps;

  const session = await mongo.getSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    const att = new Att({path: avatar_path});
    const a = await att.save(opts);
    params.avatar = a._id;
    await User.findOneAndUpdate({_id: uid}, params, opts);
    await Att.deleteOne({_id: att_id});

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  return {code: 0, data: null};
};

module.exports.addFollow = async params => {
  const follow = new Follow(params);
  return follow.save();
};

module.exports.deFollow = async (user_id, follow_id) => {
  return Follow.deleteOne({user_id, follow_id});
};

module.exports.userInfo = async (user_id, uid) => {
  const rl = await User.findById(user_id);
  const user = JSON.parse(JSON.stringify(rl));
  const att = await Att.findById(user.avatar);
  const city = await City.findOne({
    parent_id: user.city_code.substr(0, 2),
    id: user.city_code.substr(2, 2)
  });
  const role = await Dict.findById(user.role_id);
  const follow_num = await Follow.countDocuments({user_id});
  const has_follow = await Follow.countDocuments({user_id, follow_id: uid});
  const info_num = await Info.countDocuments({create_by: user_id});
  delete user.password;
  delete user.avatar;
  delete user.role_id;
  user.role = role.name;
  user.city_name = city.name;
  user.avatar_path = att.path;
  user.info_num = info_num;
  user.follow_num = follow_num;
  user.has_follow = has_follow;
  return {
    code: 0,
    data: user
  };
};
