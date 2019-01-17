const controllers = {};
controllers.att = require('./att-ctrl');
controllers.auth = require('./auth-ctrl');
controllers.postInfo = require('./postInfo-ctrl');
controllers.postWorks = require('./postWorks-ctrl');
controllers.user = require('./user-ctrl');
controllers.dict = require('./dict-ctrl');

module.exports = controllers;
