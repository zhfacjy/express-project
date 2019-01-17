const crypto = require('crypto');

const config = require('../config');
const db = require('../utils/mysql-util');

module.exports.register = async params => {
  const avatar_path = params.avatar;
  const conn = await db.openTrans();
  const sql = 'insert into att set ?';
  const rl = await db.execSql(sql, {path: avatar_path}, conn);
  const sql2 = 'insert into user set ?';
  params.avatar = rl.insertId;
  const result = await db.execSql(sql2, params, conn);
  // 加密
  const saltPassword = `${params.password}:${result.insertId}${config.salt}`;
  const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
  const sql3 = 'update user set password = ? where id = ?;';
  await db.execSql(sql3, [ps, result.insertId], conn);
  await db.commitTrans(conn);
};

module.exports.hasExistMob = async mobile => {
  const sql = 'select mobile from user where mobile = ?;';
  const rl = await db.execSql(sql, [mobile]);
  if (rl.length > 0) return {code: 401, message: '该电话号码已存在！'};
  return {code: 0, data: null};
};
