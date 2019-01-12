const { celebrate, Joi, errors } = require('celebrate');
const Controllers = require('../controllers');

module.exports = app => {
  app.get('/test', celebrate({
    query: {
      id: Joi.number().required().integer().min(1)
    }
  }), Controllers.test.testResponse);
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
