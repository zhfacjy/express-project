const db = require('../utils/mysql-util');

module.exports.getListByType = async type => {
  let sql = '';
  if (type === 1) {
    sql = 'select * from tag order by create_at desc';
  } else {
    sql = 'select * from role';
  }
  return db.execSql(sql);
};

module.exports.save = async params => {
  const table = params.type === 1 ? 'tag' : 'role';
  delete params.type;
  if (params.id) {
    const sql = `update ${table} set name = ? where id = ?`;
    return db.execSql(sql, [params.name, params.id]);
  }
  const sql = `insert into ${table} set ?`;
  return db.execSql(sql, params);
};
