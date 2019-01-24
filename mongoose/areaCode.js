module.exports.getSchema = mongoose => {
  return mongoose.model('area_code', new mongoose.Schema({
    id: String,
    parent_id: String,
    name: String
  }, {collection: 'area_code'}));
};
