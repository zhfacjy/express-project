module.exports.getSchema = mongoose => {
  return mongoose.model('collect', new mongoose.Schema({
    user_id: String,
    post_id: String,
    type: Number
  }, {collection: 'collect'}));
};
