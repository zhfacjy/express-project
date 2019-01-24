module.exports.getSchema = mongoose => {
  return mongoose.model('follow', new mongoose.Schema({
    user_id: String,
    follow_id: String
  }, {collection: 'follow'}));
};
