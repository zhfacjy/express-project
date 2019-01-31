const myServ = require('../services/my-serv');

class MyController {
  async hasCollect(req, res) {
    const hasCollect = await myServ.hasCollect(
      req.cookies.uid, req.params.post_id, req.params.type
    );
    res.send({code: 0, data: hasCollect});
  }

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
    const result = await myServ.getCollectList(req.cookies.uid);
    res.send({code: 0, data: result});
  }

  async postInfo(req, res) {
    const result = await myServ.getPostList(req.params.user_id, 2);
    res.send({code: 0, data: result});
  }

  async postWorks(req, res) {
    const result = await myServ.getPostList(req.params.user_id, 1);
    res.send({code: 0, data: result});
  }

  async receiver(req, res) {
    const result = await myServ.sendOrReceiver(req.cookies.uid, 0);
    res.send({
      code: 0,
      data: result
    });
  }

  async mySend(req, res) {
    const result = await myServ.sendOrReceiver(req.cookies.uid, 1);
    res.send({
      code: 0,
      data: result
    });
  }

  async hasNotRead(req, res) {
    const result = await myServ.hasNotRead(req.cookies.uid);
    res.send({
      code: 0,
      data: result
    });
  }
}

module.exports = new MyController();
