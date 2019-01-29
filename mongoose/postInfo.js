module.exports.getSchema = mongoose => {
  return mongoose.model('post_info', new mongoose.Schema({
    role_id: String,
    description: String,
    city_code: String,
    address: String,
    photograph_time: String,
    filming: String,
    photograph_mode: Number,
    delete_flag: {
      type: Number,
      default: 0
    },
    has_request: {
      type: Number,
      default: 0
    },
    create_by: String,
    create_by_sex: Number,
    create_at: {
      type: Date,
      default: Date.now
    }
  }, {collection: 'post_info'}));
};
