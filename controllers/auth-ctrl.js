const authServ = require('../services/auth-serv');

class AuthController {
  async login(req, res) {
    const result = await authServ.login(req.body.mobile, req.body.password);
    res.send(result);
  }
}
module.exports = new AuthController();
