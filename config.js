module.exports = {
  server_port: 3000,
  secret: 'fuck.646',
  ignoreUrl: [
    '/auth/login', '/att/view', '/postInfo/search',
    '/postWorks/search', '/user/register', '/dict'
  ], // 不需要验证的路由
  salt: 'lo#g?in', // 密码加密盐
  mysql: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'fuck.646',
    database: 'photograph',
    charset: 'utf8',
    waitForConnections: true, // 为true时，连接排队等待可用连接。为false将立即抛出错误
    connectionLimit: 10, // 单次可创建最大连接数
    queueLimit: 0, // 连接池的最大请求数，从getConnection方法前依次排队。设置为0将没有限制,
    debug: ['ComQueryPacket', 'RowDataPacket']
  }
};
