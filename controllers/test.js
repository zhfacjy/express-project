const mysql = require('../utils/mysql-util');

class TestController {
  async testResponse(req, res) {
    const fuck = await mysql.execSql(
      'select * from user where id = ?',
      [req.query.id]
    );
    res.send({
      code: 0,
      data: fuck
    });
  }
}
module.exports = new TestController();
