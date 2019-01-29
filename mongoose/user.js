module.exports.getSchema = mongoose => {
  return mongoose.model('user', new mongoose.Schema({
    username: String,
    password: String,
    mobile: String,
    avatar: String,
    city_code: String,
    sex: Number,
    role_id: String,
    create_at: {
      type: Date,
      default: Date.now
    }
  }, {collection: 'user'}));
};
