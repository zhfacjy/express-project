const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('express-async-errors');

const routes = require('./routes/routes');
const config = require('./config');
const auth = require('./middleware/auth');

const app = express();
// 跨域配置
app.use(cors());

// 请求体解析中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// token验证
app.use(auth);
// 注册路由
routes(app);

// 简单的错误处理
app.use((req, res, next) => {
  res.status(404).send('not found');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('Internal Server error');
});

// 端口监听
app.listen(config.server_port);
console.log(`server started on: ${config.server_port}`);

// process any uncaught exception
process.on('uncaughtException', crash_err => {
  console.log(crash_err, '发生致命错误，导致程序崩溃！');
  process.exit(1);
});

// 异步错误处理
// process.on('unhandledRejection', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p);
// });

module.exports = app;
