const _ = require('lodash');
const db = require('../utils/mysql-util');

module.exports.findAll = async (skip, take) => {
  const sql = `select w.*,u.username,r.name as user_role,a.path as avatar_path,u.sex
              from post_works w
            left join user u on u.id = w.create_by
            left join att a on a.id = u.avatar
            left join role r on r.id = u.role_id
              where w.delete_flag = 0
            ORDER BY w.create_at desc limit ?,?;`;
  const countSql = 'select count(id) as total from post_works where delete_flag = 0;';
  const rl = await db.execSql(sql, [skip, take]);
  const sql2 = `select a.path from att a
                  left join post_and_att b on b.att_id = a.id
                where b.post_id = ? and type = 1;`;
  const sql3 = `select name from tag t
              left join works_and_tag i on i.tag_id = t.id
              left join post_works p on p.id = i.works_id
                where p.id = ?;`;
  const content = await Promise.all(_.map(rl, async x => {
    const paths = await db.execSql(sql2, [x.id]);
    const tags = await db.execSql(sql3, [x.id]);
    x.att_path = paths.map(y => { return y.path; });
    x.tags = tags.map(y => { return y.name; });
    return x;
  }));
  const total = await db.execSql(countSql);
  return {
    content,
    totalElements: total[0].total
  };
};

module.exports.save = async params => {
  const conn = await db.openTrans();
  // 更新
  if (params.post_works.id) {
    const id = params.post_works.id;
    delete params.post_works.id;
    const sql = 'update post_works set ? where id = ?;';
    const sql2 = 'delete from works_and_tag where works_id = ?;';
    const sql3 = 'delete from att where id in(select att_id from post_and_att where post_id = ? and type = 1);';
    const sql4 = 'delete from post_and_att where post_id = ? and type = 1;';
    const sql5 = 'insert into works_and_tag set ?';
    const sql6 = 'insert into att set ?';
    const sql7 = 'insert into post_and_att set ?';
    await Promise.all([
      db.execSql(sql, [params.post_works, id], conn),
      db.execSql(sql2, [id], conn),
      db.execSql(sql3, [id], conn),
      db.execSql(sql4, [id], conn)
    ]);
    await Promise.all(_.map(params.tags, async x => {
      return db.execSql(sql5, {tag_id: x, works_id: id}, conn);
    }));
    await Promise.all(_.map(params.atts, async x => {
      const rl = await db.execSql(sql6, {path: x}, conn);
      await db.execSql(sql7, {att_id: rl.insertId, post_id: id, type: 1}, conn);
    }));
  } else {
  // 插入
    const sql = 'insert into post_works set ?';
    const sql2 = 'insert into works_and_tag set ?';
    const sql3 = 'insert into att set ?';
    const sql4 = 'insert into post_and_att set ?';
    const result = await db.execSql(sql, params.post_works, conn);
    await Promise.all(_.map(params.tags, async x => {
      return db.execSql(sql2, {tag_id: x, works_id: result.insertId}, conn);
    }));
    await Promise.all(_.map(params.atts, async x => {
      const rl = await db.execSql(sql3, {path: x}, conn);
      await db.execSql(sql4, {att_id: rl.insertId, post_id: result.insertId, type: 1}, conn);
    }));
  }
  await db.commitTrans(conn);
};

module.exports.delete = async (uid, works_id) => {
  const sql = 'update post_works set delete_flag = 1 where create_by = ? and id = ?;';
  return db.execSql(sql, [uid, works_id]);
};
