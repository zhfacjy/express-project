const postWorksServ = require('../services/postWorks-serv');

class PostWorksController {
  async findAll(req, res) {
    const result = await postWorksServ.findAll(req.query.skip, req.query.take);
    res.send({
      code: 0,
      data: result
    });
  }

  async add(req, res) {
    req.body.post_works.create_by = req.cookies.uid;
    await postWorksServ.save(req.body);
    res.send({code: 0, data: null});
  }

  async delete(req, res) {
    await postWorksServ.delete(req.cookies.uid, req.params.works_id);
    res.send({code: 0, data: null});
  }
}
module.exports = new PostWorksController();
