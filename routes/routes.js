const { celebrate, Joi, errors } = require('celebrate');

const Controllers = require('../controllers');

const pageable = celebrate({
  query: {
    skip: Joi.number().required().integer().min(0),
    take: Joi.number().required().integer().min(1)
  }
});

module.exports = app => {
  // 获取字典 1. 标签  2. 角色
  app.get('/dict', celebrate({
    query: {type: Joi.number().required().integer().valid([1, 2])}
  }), Controllers.dict.getList);
  // 添加或修改字典 1. 标签  2. 角色
  app.post('/dict/save', celebrate({
    body: Joi.object().keys({
      type: Joi.number().required().integer().valid([1, 2]),
      id: Joi.number().allow(null).integer().min(1),
      name: Joi.string().required().min(1).max(30)
    })
  }), Controllers.dict.save);
  // 判断手机号是否已存在
  app.get('/user/has/exist/:mobile', Controllers.user.hasExistMob);
  // 注册
  app.post('/user/register', celebrate({
    body: Joi.object().keys({
      username: Joi.string().required().min(1).max(100),
      password: Joi.string().required().min(1),
      mobile: Joi.string().required().length(11),
      avatar: Joi.string().required().min(1),
      city_code: Joi.string().required().length(4),
      sex: Joi.number().required().integer().valid([0, 1]),
      role_id: Joi.number().required().integer().min(1)
    })
  }), Controllers.user.register);
  // 登录
  app.post('/auth/login', celebrate({
    body: Joi.object().keys({
      mobile: Joi.string().required().length(11),
      password: Joi.string().required().allow().min(1).max(256)
    })
  }), Controllers.auth.login);
  // 图片上传
  app.post('/att/upload', Controllers.att.uploadFile);
  // 图片预览
  app.get('/att/view', celebrate({
    query: {
      path: Joi.string().required().min(1).max(100)
    }
  }), Controllers.att.view);
  // 约拍列表
  app.post('/postInfo/search', pageable, celebrate({
    body: Joi.object().keys({
      city_code: Joi.string().allow(null).allow('').max(4),
      sex: Joi.number().integer().allow(null).valid([0, 1]),
      role_id: Joi.number().integer().allow(null)
    })
  }), Controllers.postInfo.findAll);
  // 同城约拍列表
  app.post('/postInfo/same/city', pageable, celebrate({
    body: Joi.object().keys({
      city_code: Joi.string().allow(null).allow('').max(4),
      sex: Joi.number().integer().allow(null).valid([0, 1]),
      role_id: Joi.number().integer().allow(null)
    })
  }), Controllers.postInfo.sameCity);
  // 添加或修改约拍
  app.post('/postInfo/add', celebrate({
    body: Joi.object().keys({
      post_info: Joi.object().required().keys({
        id: Joi.number().allow(null).integer().min(1),
        description: Joi.string().required().min(1).max(500),
        city_code: Joi.string().required().allow(null).allow('').max(4),
        address: Joi.string().allow(null).allow('').max(100),
        photograph_time: Joi.string().allow(null).allow('').max(100),
        filming: Joi.string().allow(null).allow('').max(100),
        photograph_mode: Joi.number().integer().allow(null),
        role_id: Joi.number().integer().allow(null)
      }),
      tags: Joi.array().items(Joi.number().integer().min(1)).unique(),
      atts: Joi.array().items(Joi.string().max(100))
    })
  }), Controllers.postInfo.add);
  // 删除约拍
  app.delete('/postInfo/:info_id', celebrate({
    params: {info_id: Joi.number().required().integer().min(1)}
  }), Controllers.postInfo.delete);
  // 作品列表
  app.get('/postWorks/search', pageable, Controllers.postWorks.findAll);
  // 添加或修改作品
  app.post('/postWorks/add', celebrate({
    body: Joi.object().keys({
      post_works: Joi.object().required().keys({
        id: Joi.number().allow(null).integer().min(1),
        description: Joi.string().required().min(1).max(500),
        title: Joi.string().required().min(1).max(100),
        device: Joi.string().allow(null).allow('').max(100),
        address: Joi.string().allow(null).allow('').max(100),
        return_film: Joi.number().required().integer().valid([0, 1])
      }),
      tags: Joi.array().items(Joi.number().integer().min(1)).unique(),
      atts: Joi.array().min(1).items(Joi.string().max(100))
    })
  }), Controllers.postWorks.add);
  // 删除作品
  app.delete('/postWorks/:works_id', celebrate({
    params: {works_id: Joi.number().required().integer().min(1)}
  }), Controllers.postWorks.delete);

  app.use(errors());
};
