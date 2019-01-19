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

module.exports.modify = async (params, id) => {
  const sql4 = 'select mobile from user where mobile = ?;';
  const rl = await db.execSql(sql4, [params.mobile]);
  if (rl.length > 0) return {code: 401, message: '该电话号码已存在！'};
  const avatar_path = params.avatar;
  const conn = await db.openTrans();
  const sql3 = 'delete from att where id = (select avatar from user where id = ?)';
  const sql = 'insert into att set ?';
  const rl2 = await Promise.all([
    db.execSql(sql, {path: avatar_path}, conn),
    db.execSql(sql3, [id], conn)
  ]);
  // 加密
  const saltPassword = `${params.password}:${id}${config.salt}`;
  const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
  const sql2 = 'update user set ? where id = ?';
  params.avatar = rl2[0].insertId;
  params.password = ps;
  await db.execSql(sql2, [params, id], conn);
  await db.commitTrans(conn);
  return {code: 0, data: null};
};

module.exports.addFollow = async params => {
  const sql = 'insert into follow set ?';
  return db.execSql(sql, params);
};

module.exports.deFollow = async (user_id, follow_id) => {
  const sql = 'delete from follow where user_id = ? and follow_id = ?;';
  return db.execSql(sql, [user_id, follow_id]);
};

module.exports.userInfo = async (user_id, uid) => {
  const sql = `select u.id,u.username,u.sex,a.path as avatar_path,
                r.name as role_name,c.name as city_name
                  from user u
                left join att a on a.id = u.avatar
                left join role r on r.id = u.role_id
                left join area_code c on c.id = SUBSTR(u.city_code,3,2) and c.parent_id = SUBSTR(u.city_code,1,2)
              where u.id = ?;`;
  const sql2 = 'select count(*) as info_num from post_info where create_by = ? and delete_flag = 0;';
  const sql3 = 'select count(*) as follow_num from follow where user_id = ?;';
  const sql4 = 'select count(*) as has_follow from follow where user_id = ? and follow_id = ?;';
  const rl = await Promise.all([
    db.execSql(sql, [user_id]),
    db.execSql(sql2, [user_id]),
    db.execSql(sql3, [user_id]),
    db.execSql(sql4, [user_id, uid])
  ]);
  const user = rl[0][0];
  user.info_num = rl[1][0].info_num;
  user.follow_num = rl[2][0].follow_num;
  user.has_follow = rl[3][0].has_follow;
  return user;
};
