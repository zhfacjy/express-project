const postInfoServ = require('../services/postInfo-serv');

class PostInfoController {
  async findAll(req, res) {
    const result = await postInfoServ.findAll(req.body, req.query.skip, req.query.take, false);
    res.send({
      code: 0,
      data: result
    });
  }

  async sameCity(req, res) {
    req.body.uid = req.cookies.uid;
    const result = await postInfoServ.findAll(req.body, req.query.skip, req.query.take, true);
    res.send({
      code: 0,
      data: result
    });
  }

  async add(req, res) {
    req.body.post_info.create_by = req.cookies.uid;
    await postInfoServ.save(req.body);
    res.send({code: 0, data: null});
  }

  async delete(req, res) {
    await postInfoServ.delete(req.cookies.uid, req.params.info_id);
    res.send({code: 0, data: null});
  }

  async addRequest(req, res) {
    await postInfoServ.addRequest(req.body);
    res.send({code: 0, data: null});
  }
}
module.exports = new PostInfoController();
