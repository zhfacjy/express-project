module.exports = {
  server_port: 3000,
  secret: 'fuck.646',
  ignoreUrl: [
    '/auth/login', '/att/view', '/build', '/build/imp', '/att/upload',
    '/user/register', '/dict', '/auth/admin/login'
  ], // 不需要验证的路由
  specialUrl: ['/postInfo/search', '/postWorks/search'], // 特殊的路由
  salt: 'lo#g?in', // 密码加密盐
  mongo: {
    url: 'mongodb://localhost:57017,localhost:57018/test', // test 是数据库，2个localhost是主从mongo地址
    // url: 'mongodb://localhost:27017,localhost:33213/fuckdb0', // test 是数据库，2个localhost是主从mongo地址
    options: {
      replicaSet: 'rs',
      // replicaSet: 'rs0',
      poolSize: 10,
      // w: 1,
      useNewUrlParser: true
    }
  }
};
