module.exports.getSchema = mongoose => {
  return mongoose.model('collect', new mongoose.Schema({
    user_id: String,
    post_id: String,
    delete_flag: {
      type: Number,
      default: 0
    },
    type: Number
  }, {collection: 'collect'}));
};
