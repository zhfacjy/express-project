module.exports = {
  server_port: 3000,
  secret: 'fuck.646',
  ignoreUrl: [
    '/auth/login', '/att/view', '/postInfo/search',
    '/postWorks/search', '/user/register', '/dict'
  ], // 不需要验证的路由
  salt: 'lo#g?in', // 密码加密盐
  mongo: {
    url: 'mongodb://localhost:57017,localhost:57018/test', // test 是数据库，2个localhost是主从mongo地址
    options: {
      replicaSet: 'rs',
      poolSize: 10,
      // w: 1,
      useNewUrlParser: true
    }
  }
};
