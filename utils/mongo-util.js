const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { mongo } = require('../config');

mongoose.connect(mongo.url, mongo.options);

const dir = path.join(__dirname, '../mongoose/');
const files = fs.readdirSync(dir);
const modules = [];
_.forEach(files, x => {
  const file = require(path.join(dir, x));// eslint-disable-line
  const module = file.getSchema(mongoose);
  modules.push({collection: x, m: module});
});

module.exports.getModule = collection => {
  const has = _.find(modules, x => x.collection === `${collection}.js`);
  return has.m;
};

module.exports.getSession = async () => {
  const session = await mongoose.startSession();
  return session;
};

// 创建表
module.exports.buildCollection = async () => {
  await Promise.all(_.map(modules, async x => {
    await x.m.create([{}]);
    await x.m.remove({});
  }));
};
