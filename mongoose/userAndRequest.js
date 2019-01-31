module.exports.getSchema = mongoose => {
  return mongoose.model('user_and_request', new mongoose.Schema({
    post_id: String,
    user_id: String,
    content: String,
    contact: String,
    create_by: String,
    has_read: {
      type: Number,
      default: 0
    },
    create_at: {
      type: Date,
      default: Date.now
    }
  }, {collection: 'user_and_request'}));
};
