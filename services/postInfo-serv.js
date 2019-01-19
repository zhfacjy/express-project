const _ = require('lodash');
const db = require('../utils/mysql-util');

module.exports.findAll = async (params, skip, take, same_city) => {
  let sql = `select i.*,u.username,r.name as user_role,
            a.path as avatar_path,c.name as city_name,u.sex
                from post_info i
              left join user u on u.id = i.create_by
              left join att a on a.id = u.avatar
              left join role r on r.id = u.role_id
              left join area_code c on c.id = SUBSTR(i.city_code,3,2) and c.parent_id = SUBSTR(i.city_code,1,2)
                where i.delete_flag = 0`;
  let countSql = `select count(i.id) as total
                      from post_info i
                  left join user u on u.id = i.create_by
                  left join role r on r.id = u.role_id
                    where i.delete_flag = 0`;
  let query = '';
  const pm = [];
  const pm2 = [];
  if (params.sex !== null) {
    query += ' and u.sex = ?';
    pm.push(params.sex);
    pm2.push(params.sex);
  }
  if (params.role_id) {
    query += ' and i.role_id = ?';
    pm.push(params.role_id);
    pm2.push(params.role_id);
  }
  if (params.city_code) {
    query += ' and i.city_code = ?';
    pm.push(params.city_code);
    pm2.push(params.city_code);
  } else if (same_city) {
    query += ' and i.city_code = (select city_code from user where id = ?) ';
    pm.push(params.uid);
    pm2.push(params.uid);
  }
  sql += `${query} order by create_at desc limit ?,?;`;
  pm.push(skip);
  pm.push(take);
  const rl = await db.execSql(sql, pm);
  const sql2 = `select a.path from att a
                  left join post_and_att b on b.att_id = a.id
                where b.post_id = ? and type = 2;`;
  const sql3 = `select name from tag t
                  left join info_and_tag i on i.tag_id = t.id
                  left join post_info p on p.id = i.info_id
                where p.id = ?;`;
  const content = await Promise.all(_.map(rl, async x => {
    const paths = await db.execSql(sql2, [x.id]);
    const tags = await db.execSql(sql3, [x.id]);
    x.att_path = paths.map(y => { return y.path; });
    x.tags = tags.map(y => { return y.name; });
    return x;
  }));
  countSql += query;
  const total = await db.execSql(countSql, pm2);
  return {
    content,
    totalElements: total[0].total
  };
};

module.exports.save = async params => {
  const conn = await db.openTrans();
  // 更新
  if (params.post_info.id) {
    const id = params.post_info.id;
    delete params.post_info.id;
    const sql = 'update post_info set ? where id = ?;';
    const sql2 = 'delete from info_and_tag where info_id = ?;';
    const sql3 = 'delete from att where id in(select att_id from post_and_att where post_id = ? and type = 2);';
    const sql4 = 'delete from post_and_att where post_id = ? and type = 2;';
    const sql5 = 'insert into info_and_tag set ?';
    const sql6 = 'insert into att set ?';
    const sql7 = 'insert into post_and_att set ?';
    await Promise.all([
      db.execSql(sql, [params.post_info, id], conn),
      db.execSql(sql2, [id], conn),
      db.execSql(sql3, [id], conn),
      db.execSql(sql4, [id], conn)
    ]);
    await Promise.all(_.map(params.tags, async x => {
      return db.execSql(sql5, {tag_id: x, info_id: id}, conn);
    }));
    await Promise.all(_.map(params.atts, async x => {
      const rl = await db.execSql(sql6, {path: x}, conn);
      await db.execSql(sql7, {att_id: rl.insertId, post_id: id, type: 2}, conn);
    }));
  } else {
  // 插入
    const sql = 'insert into post_info set ?';
    const sql2 = 'insert into info_and_tag set ?';
    const sql3 = 'insert into att set ?';
    const sql4 = 'insert into post_and_att set ?';
    const result = await db.execSql(sql, params.post_info, conn);
    await Promise.all(_.map(params.tags, async x => {
      return db.execSql(sql2, {tag_id: x, info_id: result.insertId}, conn);
    }));
    await Promise.all(_.map(params.atts, async x => {
      const rl = await db.execSql(sql3, {path: x}, conn);
      await db.execSql(sql4, {att_id: rl.insertId, post_id: result.insertId, type: 2}, conn);
    }));
  }
  await db.commitTrans(conn);
};

module.exports.delete = async (uid, info_id) => {
  const sql = 'update post_info set delete_flag = 1 where create_by = ? and id = ?;';
  return db.execSql(sql, [uid, info_id]);
};

module.exports.addRequest = async params => {
  const sql = 'insert into user_and_request set ?';
  return db.execSql(sql, params);
};
