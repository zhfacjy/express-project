module.exports.getSchema = mongoose => {
  return mongoose.model('post_and_tag', new mongoose.Schema({
    tag_id: String,
    post_id: String,
    type: Number
  }, {collection: 'post_and_tag'}));
};
