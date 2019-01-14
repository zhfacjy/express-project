const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const config = require('../config');
const db = require('../utils/mysql-util');

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

module.exports.login = async (mobile, password) => {
  let sql = 'select id from user where mobile = ?';
  const id = await db.execSql(sql, [mobile]);
  if (id.length === 0) {
    return {code: 400, data: {message: '该用户不存在！'}};
  }
  // 加密
  const saltPassword = `${password}:${id[0].id}${config.salt}`;
  const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
  sql = `select a.*,b.path as avatar_path from user a 
          left join att b on a.avatar = b.id
        where a.mobile = ? and password = ?`;
  const user = await db.execSql(sql, [mobile, ps]);
  if (user.length === 0) {
    return {code: 400, data: {message: '账号或密码错误！'}};
  }
  delete user[0].password;
  delete user[0].avatar;
  const token = await jwtSign({uid: user[0].id, city: user[0].city_code, role: user[0].role_id});
  user[0].token = token;
  return {
    code: 0,
    data: user[0]
  };
};
