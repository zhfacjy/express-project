const myServ = require('../services/my-serv');

class MyController {
  async addCollect(req, res) {
    req.body.user_id = req.cookies.uid;
    await myServ.addCollect(req.body);
    res.send({code: 0, data: null});
  }

  async removeCollect(req, res) {
    await myServ.removeCollect(req.params.post_id, req.cookies.uid, req.params.type);
    res.send({code: 0, data: null});
  }

  async collectList(req, res) {
    const result = await myServ.getCollectList(
      req.cookies.uid, req.params.type,
      req.query.skip, req.query.take
    );
    res.send(result);
  }

  async postInfo(req, res) {
    const result = await myServ.getPostList(
      req.params.user_id, 2,
      req.query.skip, req.query.take
    );
    res.send(result);
  }

  async postWorks(req, res) {
    const result = await myServ.getPostList(
      req.params.user_id, 1,
      req.query.skip, req.query.take
    );
    res.send(result);
  }
}

module.exports = new MyController();
