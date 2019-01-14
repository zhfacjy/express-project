const { celebrate, Joi, errors } = require('celebrate');
const Controllers = require('../controllers');

module.exports = app => {
  // 登录
  app.post('/auth/login', celebrate({
    body: Joi.object().keys({
      mobile: Joi.string().required().length(11),
      password: Joi.string().required().allow().min(1).max(256)
    })
  }), Controllers.auth.login);

  // app.route('/article/:_id')
  //   .get(Controllers.article.detail)
  //   .put(Controllers.article.update)
  // // app.route('/upload')
  // //   .post(upload, Controllers.article.upload)
  // app.route('/upload')
  //   .post(Controllers.article.upload)
  // app.route('/test')
  //   .post(Controllers.test.testResponse)

  app.use(errors());
};
