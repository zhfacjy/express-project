module.exports.getSchema = mongoose => {
  return mongoose.model('att', new mongoose.Schema({
    path: String,
    create_at: {
      type: Date,
      default: new Date()
    }
  }, {collection: 'att'}));
};
