const authServ = require('../services/auth-serv');

class AuthController {
  async login(req, res) {
    const result = await authServ.login(req.body.mobile, req.body.password, false);
    res.send(result);
  }

  async adminLogin(req, res) {
    const result = await authServ.login(req.body.mobile, req.body.password, true);
    res.send(result);
  }
}
module.exports = new AuthController();
