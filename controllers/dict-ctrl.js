const dictServ = require('../services/dict-serv');

class DictController {
  async getList(req, res) {
    const result = await dictServ.getListByType(req.query.type);
    res.send({
      code: 0,
      data: result
    });
  }

  async save(req, res) {
    req.body.create_by = req.cookies.uid;
    await dictServ.save(req.body);
    res.send({
      code: 0,
      data: null
    });
  }
}

module.exports = new DictController();
