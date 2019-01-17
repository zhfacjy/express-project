const postInfoServ = require('../services/postInfo-serv');

class PostInfoController {
  async findAll(req, res) {
    const result = await postInfoServ.findAll(req.body, req.query.skip, req.query.take);
    res.send({
      code: 0,
      data: result
    });
  }

  async sameCity(req, res) {
    const result = await postInfoServ.sameCity(req.body, req.query.skip, req.query.take);
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
}
module.exports = new PostInfoController();
