const mongo = require('../utils/mongo-util');

const Dict = mongo.getModule('dict');

module.exports.getListByType = async type => {
  if (type === 2) return  Dict.find({type: type, name: {$ne: 'admin'}}, {dict_code: 1, name: 1});
  return Dict.find({type: type}, {_id: 1, name: 1});
};

module.exports.save = async params => {
  if (params.id) {
    return Dict.findOneAndUpdate({_id: params.id}, {name: params.name});
  }
  const dict = new Dict({name: params.name, type: params.type, create_by: params.create_by});
  return dict.save();
};
