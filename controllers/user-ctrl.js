const userServ = require('../services/user-serv');

class UserController {
  async register(req, res) {
    await userServ.register(req.body);
    res.send({
      code: 0,
      data: null
    });
  }

  async hasExistMob(req, res) {
    const result = await userServ.hasExistMob(req.params.mobile);
    res.send(result);
  }
}

module.exports = new UserController();
