module.exports.getSchema = mongoose => {
  return mongoose.model('post_and_att', new mongoose.Schema({
    att_id: String,
    post_id: String,
    type: Number
  }, {collection: 'post_and_att'}));
};
