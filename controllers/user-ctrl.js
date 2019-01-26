const userServ = require('../services/user-serv');

class UserController {
  async register(req, res) {
    const result = await userServ.register(req.body);
    res.send(result);
  }

  async modify(req, res) {
    const result = await userServ.modify(req.body, req.cookies.uid);
    res.send(result);
  }

  async hasExistMob(req, res) {
    const result = await userServ.hasExistMob(req.params.mobile);
    res.send(result);
  }

  async follow(req, res) {
    if (req.params.user_id !== req.cookies.uid) {
      await userServ.addFollow({user_id: req.params.user_id, follow_id: req.cookies.uid});
    }
    res.send({code: 0, data: null});
  }

  async deFollow(req, res) {
    await userServ.deFollow(req.params.user_id, req.cookies.uid);
    res.send({code: 0, data: null});
  }

  async userInfo(req, res) {
    const result = await userServ.userInfo(req.params.user_id, req.cookies.uid);
    res.send(result);
  }
}

module.exports = new UserController();
