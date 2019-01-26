const { celebrate, Joi, errors } = require('celebrate');

const Controllers = require('../controllers');

const pageable = celebrate({
  query: {
    skip: Joi.number().required().integer().min(0),
    take: Joi.number().required().integer().min(1)
  }
});

module.exports = app => {
  // 创建表
  app.get('/build', Controllers.build.build);
  // 导入city、dict 数据
  app.get('/build/imp', Controllers.build.impData);

  // 获取字典 1. 标签  2. 角色
  app.get('/dict', celebrate({
    query: {type: Joi.number().required().integer().valid([1, 2])}
  }), Controllers.dict.getList);
  // 添加或修改字典 1. 标签  2. 角色
  app.post('/dict/save', celebrate({
    body: Joi.object().keys({
      type: Joi.number().required().integer().valid([1, 2]),
      id: Joi.string().allow(null).allow('').min(1),
      name: Joi.string().required().min(1).max(30)
    })
  }), Controllers.dict.save);

  // 判断手机号是否已存在
  app.get('/user/has/exist/:mobile', celebrate({
    params: {mobile: Joi.string().required().length(11)}
  }), Controllers.user.hasExistMob);
  // 注册
  app.post('/user/register', celebrate({
    body: Joi.object().keys({
      username: Joi.string().required().min(1).max(100),
      password: Joi.string().required().min(1),
      mobile: Joi.string().required().length(11),
      avatar: Joi.string().required().min(1),
      city_code: Joi.string().required().length(4),
      sex: Joi.number().required().integer().valid([0, 1]),
      role_id: Joi.string().required().min(1)
    })
  }), Controllers.user.register);
  // 修改个人信息
  app.post('/user/modify', celebrate({
    body: {
      username: Joi.string().required().min(1).max(100),
      password: Joi.string().required().min(1),
      mobile: Joi.string().required().length(11),
      avatar: Joi.string().required().min(1),
      city_code: Joi.string().required().length(4),
      sex: Joi.number().required().integer().valid([0, 1]),
      role_id: Joi.string().required().min(1)
    }
  }), Controllers.user.modify);
  // 关注
  app.post('/user/follow/:user_id', celebrate({
    params: {
      user_id: Joi.string().required().min(1)
    }
  }), Controllers.user.follow);
  // 取消关注
  app.delete('/user/follow/:user_id', celebrate({
    params: {
      user_id: Joi.string().required().min(1)
    }
  }), Controllers.user.deFollow);
  // 个人信息
  app.get('/user/info/:user_id', celebrate({
    params: {user_id: Joi.string().required().min(1)}
  }), Controllers.user.userInfo);
  // 获取用户列表
  app.get('/user/list', pageable, Controllers.user.getList);
  // 删除用户
  app.delete('/user/:user_id', celebrate({
    params: {
      user_id: Joi.string().required().min(1)
    }
  }), Controllers.user.deleteUser);

  // 登录
  app.post('/auth/login', celebrate({
    body: Joi.object().keys({
      mobile: Joi.string().required().length(11),
      password: Joi.string().required().allow().min(1).max(256)
    })
  }), Controllers.auth.login);
  // 后台登录
  app.post('/auth/admin/login', celebrate({
    body: Joi.object().keys({
      mobile: Joi.string().required().length(11),
      password: Joi.string().required().allow().min(1).max(256)
    })
  }), Controllers.auth.adminLogin);

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
      role_id: Joi.string().allow(null).allow('')
    })
  }), Controllers.postInfo.findAll);
  // 同城约拍列表
  app.post('/postInfo/same/city', pageable, celebrate({
    body: Joi.object().keys({
      city_code: Joi.string().allow(null).allow('').max(4),
      sex: Joi.number().integer().allow(null).valid([0, 1]),
      role_id: Joi.string().allow(null).allow('')
    })
  }), Controllers.postInfo.sameCity);
  // 添加或修改约拍
  app.post('/postInfo/add', celebrate({
    body: Joi.object().keys({
      post_info: Joi.object().required().keys({
        id: Joi.string().allow(null).allow('').min(1),
        description: Joi.string().required().min(1).max(500),
        city_code: Joi.string().required().allow(null).allow('').max(4),
        address: Joi.string().allow(null).allow('').max(100),
        photograph_time: Joi.string().allow(null).allow('').max(100),
        filming: Joi.string().allow(null).allow('').max(100),
        photograph_mode: Joi.number().integer().allow(null),
        role_id: Joi.string().required().min(1)
      }),
      tags: Joi.array().items(Joi.string().min(1)).unique(),
      atts: Joi.array().items(Joi.string().max(100))
    })
  }), Controllers.postInfo.add);
  // 删除约拍
  app.delete('/postInfo/:info_id', celebrate({
    params: {info_id: Joi.string().required().min(1)}
  }), Controllers.postInfo.delete);
  // 发起请求
  app.post('/postInfo/request', celebrate({
    body: Joi.object().keys({
      post_id: Joi.string().required().min(1),
      user_id: Joi.string().required().min(1),
      content: Joi.string().allow(null).allow('').max(300),
      contact: Joi.string().allow(null).allow('').max(30)
    })
  }), Controllers.postInfo.addRequest);

  // 作品列表
  app.get('/postWorks/search', pageable, Controllers.postWorks.findAll);
  // 添加或修改作品
  app.post('/postWorks/add', celebrate({
    body: Joi.object().keys({
      post_works: Joi.object().required().keys({
        id: Joi.string().allow(null).allow(''),
        description: Joi.string().required().min(1).max(500),
        title: Joi.string().required().min(1).max(100),
        device: Joi.string().allow(null).allow('').max(100),
        address: Joi.string().allow(null).allow('').max(100),
        return_film: Joi.number().required().integer().valid([0, 1])
      }),
      tags: Joi.array().items(Joi.string().min(1)).unique(),
      atts: Joi.array().min(1).items(Joi.string().max(100))
    })
  }), Controllers.postWorks.add);
  // 删除作品
  app.delete('/postWorks/:works_id', celebrate({
    params: {works_id: Joi.number().required().integer().min(1)}
  }), Controllers.postWorks.delete);

  // 收藏
  app.post('/my/collect', celebrate({
    body: {
      post_id: Joi.string().required().min(1),
      type: Joi.number().required().integer().valid([1, 2])
    }
  }), Controllers.my.addCollect);
  // 删除收藏
  app.delete('/my/collect/:post_id/:type', celebrate({
    params: {
      post_id: Joi.string().required().min(1),
      type: Joi.number().required().integer().valid([1, 2])
    }
  }), Controllers.my.removeCollect);
  // 我收藏的
  app.get('/my/collect/:type', pageable, celebrate({
    params: {
      type: Joi.number().required().integer().valid([1, 2])
    }
  }), Controllers.my.collectList);
  // 我的约拍
  app.get('/my/postInfo/:user_id', pageable, celebrate({
    params: {user_id: Joi.string().required().min(1)}
  }), Controllers.my.postInfo);
  // 我的作品
  app.get('/my/postWorks/:user_id', pageable, celebrate({
    params: {user_id: Joi.string().required().min(1)}
  }), Controllers.my.postWorks);
  // 我接收的
  app.get('/my/receiver', pageable, Controllers.my.receiver);

  app.use(errors());
};
