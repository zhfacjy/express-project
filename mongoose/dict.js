module.exports.getSchema = mongoose => {
  return mongoose.model('dict', new mongoose.Schema({
    name: String,
    type: Number,
    create_by: String,
    create_at: {
      type: Date,
      default: new Date()
    }
  }, {collection: 'dict'}));
};
