const _ = require('lodash');
const db = require('../utils/mysql-util');

module.exports.addCollect = async params => {
  const sql = 'insert into collect set ?';
  return db.execSql(sql, params);
};

module.exports.removeCollect = async (post_id, user_id, type) => {
  const sql = 'delete from collect where post_id = ? and user_id = ? and type = ?;';
  return db.execSql(sql, [post_id, user_id, type]);
};

module.exports.getCollectList = async (user_id, type, skip, take) => {
  const sql2 = `select a.path from att a
                  left join post_and_att b on b.att_id = a.id
                where b.post_id = ? and type = ?;`;
  // 1.作品works 2.约拍信息info
  if (type === 1) {
    const sql = `select w.*,u.username,r.name as user_role,a.path as avatar_path,u.sex
                  from collect c
                left join post_works w on w.id = c.post_id
                left join user u on u.id = w.create_by
                left join att a on a.id = u.avatar
                left join role r on r.id = u.role_id
                  where w.delete_flag = 0 and c.type = 1 and c.user_id = ?
                ORDER BY w.create_at desc limit ?,?;`;
    const countSql = `select count(w.id) as total
                        from collect c
                      left join post_works w on w.id = c.post_id
                        where c.type = 1 and c.user_id = ? and w.delete_flag = 0`;
    const sql3 = `select name from tag t
                left join works_and_tag i on i.tag_id = t.id
                left join post_works p on p.id = i.works_id
                  where p.id = ?;`;
    const rl = await db.execSql(sql, [user_id, skip, take]);
    const content = await Promise.all(_.map(rl, async x => {
      const paths = await db.execSql(sql2, [x.id, type]);
      const tags = await db.execSql(sql3, [x.id]);
      x.att_path = paths.map(y => { return y.path; });
      x.tags = tags.map(y => { return y.name; });
      return x;
    }));
    const total = await db.execSql(countSql, [user_id]);
    return {
      content,
      totalElements: total[0].total
    };
  }
  const sql = `select i.*,u.username,r.name as user_role,
            a.path as avatar_path,c.name as city_name,u.sex
                from collect ct
              left join post_info i on i.id = ct.post_id
              left join user u on u.id = i.create_by
              left join att a on a.id = u.avatar
              left join role r on r.id = u.role_id
              left join area_code c on c.id = SUBSTR(i.city_code,3,2) and c.parent_id = SUBSTR(i.city_code,1,2)
                where i.delete_flag = 0 and ct.type = 2 and ct.user_id = ?
              ORDER BY i.create_at desc limit ?,?;`;
  const countSql = `select count(i.id) as total
                      from collect c
                    left join post_info i on i.id = c.post_id
                      where i.delete_flag = 0 and c.type = 2 and c.user_id = ?;`;
  const sql3 = `select name from tag t
              left join info_and_tag i on i.tag_id = t.id
              left join post_info p on p.id = i.info_id
                where p.id = ?;`;
  const rl = await db.execSql(sql, [user_id, skip, take]);
  const content = await Promise.all(_.map(rl, async x => {
    const paths = await db.execSql(sql2, [x.id, type]);
    const tags = await db.execSql(sql3, [x.id]);
    x.att_path = paths.map(y => { return y.path; });
    x.tags = tags.map(y => { return y.name; });
    return x;
  }));
  const total = await db.execSql(countSql, [user_id]);
  return {
    content,
    totalElements: total[0].total
  };
};

module.exports.getPostList = async (user_id, type, skip, take) => {
  const sql2 = `select a.path from att a
              left join post_and_att b on b.att_id = a.id
                where b.post_id = ? and type = ?;`;
  if (type === 1) {
    const sql = `select w.*,u.username,r.name as user_role,a.path as avatar_path,u.sex
                  from post_works w
                left join user u on u.id = w.create_by
                left join att a on a.id = u.avatar
                left join role r on r.id = u.role_id
                  where w.delete_flag = 0 and w.create_by = ?
                ORDER BY w.create_at desc limit ?,?;`;
    const countSql = 'select count(w.id) as total from post_works w where w.create_by = ? and w.delete_flag = 0';
    const sql3 = `select name from tag t
                left join works_and_tag i on i.tag_id = t.id
                left join post_works p on p.id = i.works_id
                  where p.id = ?;`;
    const rl = await db.execSql(sql, [user_id, skip, take]);
    const content = await Promise.all(_.map(rl, async x => {
      const paths = await db.execSql(sql2, [x.id, type]);
      const tags = await db.execSql(sql3, [x.id]);
      x.att_path = paths.map(y => { return y.path; });
      x.tags = tags.map(y => { return y.name; });
      return x;
    }));
    const total = await db.execSql(countSql, [user_id]);
    return {
      content,
      totalElements: total[0].total
    };
  }
  const sql = `select i.*,u.username,r.name as user_role,
            a.path as avatar_path,c.name as city_name,u.sex
                from post_info i
              left join user u on u.id = i.create_by
              left join att a on a.id = u.avatar
              left join role r on r.id = u.role_id
              left join area_code c on c.id = SUBSTR(i.city_code,3,2) and c.parent_id = SUBSTR(i.city_code,1,2)
                where i.delete_flag = 0 and i.create_by = ?
              ORDER BY i.create_at desc limit ?,?;`;
  const countSql = 'select count(i.id) as total from post_info i where i.delete_flag = 0 and i.create_by = ?;';
  const sql3 = `select name from tag t
              left join info_and_tag i on i.tag_id = t.id
              left join post_info p on p.id = i.info_id
                where p.id = ?;`;
  const rl = await db.execSql(sql, [user_id, skip, take]);
  const content = await Promise.all(_.map(rl, async x => {
    const paths = await db.execSql(sql2, [x.id, type]);
    const tags = await db.execSql(sql3, [x.id]);
    x.att_path = paths.map(y => { return y.path; });
    x.tags = tags.map(y => { return y.name; });
    return x;
  }));
  const total = await db.execSql(countSql, [user_id]);
  return {
    content,
    totalElements: total[0].total
  };
};
