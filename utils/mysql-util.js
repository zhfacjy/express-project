const mysql = require('mysql');
const config = require('../config');

const pool = mysql.createPool(config.mysql);

module.exports = {
  // 开启事务
  openTrans: () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        } else {
          conn.beginTransaction(err2 => {
            if (err2) {
              conn.release();
              reject(err2);
            }
            resolve(conn);
          });
        }
      });
    });
  },
  // 提交事务
  commitTrans: conn => {
    return new Promise((resolve, reject) => {
      conn.commit(err => {
        if (err) {
          conn.rollback(() => {
            reject(err);
          });
        }
      });
      resolve();
    });
  },
  // 回滚事务
  rollBackTrans: conn => {
    return new Promise(resolve => {
      conn.rollback(() => {
        resolve();
      });
    });
  },
  // 执行单条sql
  execSql: (sql, params, conn) => {
    // 事务里面执行的
    if (conn) {
      return new Promise((resolve, reject) => {
        conn.query(sql, params, (err, results) => {
          if (err) {
            conn.rollback();
            reject(err);
          }
          resolve(results);
        });
      });
    }
    // 非事务执行
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) reject(err);
        connection.query(sql, params, (err2, results) => {
          if (err2) reject(err2);
          resolve(results);
        });
      });
    });
  }
};
