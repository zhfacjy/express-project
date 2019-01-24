const controllers = {};
controllers.att = require('./att-ctrl');
controllers.auth = require('./auth-ctrl');
controllers.postInfo = require('./postInfo-ctrl');
controllers.postWorks = require('./postWorks-ctrl');
controllers.user = require('./user-ctrl');
controllers.dict = require('./dict-ctrl');
controllers.my = require('./my-ctrl');
controllers.build = require('./build-ctrl');

module.exports = controllers;
