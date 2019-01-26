const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const config = require('../config');
const mongo = require('../utils/mongo-util');

const Dict = mongo.getModule('dict');

// 包装生成令牌异步函数
const jwtSign = data => {
  return new Promise((resolve, reject) => {
    jwt.sign(data, config.secret, {
      expiresIn: 60 * 60 * 24 * 30 // 测试阶段，token 有效时间 30 天
    }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports.login = async (mobile, password, isAdmin) => {
  if (isAdmin) {
    const role = await Dict.countDocuments({name: '管理员', type: 2});
    if (role === 0) return {code: 400, data: {message: '该用户不是管理员！'}};
  }
  const query = mongo.getModule('user').where({mobile: mobile});
  const user = await query.findOne();
  if (!user) {
    return {code: 400, data: {message: '该用户不存在！'}};
  }
  // 加密
  const saltPassword = `${password}:${user._id}${config.salt}`;
  const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
  if (user.password !== ps) {
    return {code: 400, data: {message: '账号或密码错误！'}};
  }
  const query2 = mongo.getModule('att').where({_id: user.avatar});
  const att = await query2.findOne();
  const token = await jwtSign({uid: user._id, city: user.city_code});
  return {
    code: 0,
    data: {
      token,
      id: user._id,
      username: user.username,
      city_code: user.city_code,
      avatar_path: att.path,
      role: user.role_id
    }
  };
};
