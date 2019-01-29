module.exports.getSchema = mongoose => {
  return mongoose.model('post_works', new mongoose.Schema({
    title: String,
    description: String,
    device: String,
    address: String,
    return_film: Number,
    delete_flag: {
      type: Number,
      default: 0
    },
    create_by: String,
    create_at: {
      type: Date,
      default: Date.now
    }
  }, {collection: 'post_works'}));
};
