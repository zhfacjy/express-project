const jwt = require('jsonwebtoken');
const config = require('../config');

// 包装验证令牌异步函数
const jwtVerify = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = async (req, res, next) => {
  if (config.ignoreUrl.indexOf(req.path) === -1) {
    const query = req.query || {};
    const jwtToken = req.get('x-access-token') || query.token;
    try {
      req.cookies = await jwtVerify(jwtToken, config.secret);
    } catch (e) {
      // token 验证失败
      res.status(403).send('身份验证失败，可能 token 已过期');
      next(e);
    }
  }
  next();
};
