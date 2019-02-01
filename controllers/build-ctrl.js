const crypto = require('crypto');
const mongo = require('../utils/mongo-util');
const cityData = require('../utils/cityData');
const dictData = require('../utils/dictData');
const config = require('../config');

const AreaCode = mongo.getModule('areaCode');
const Dict = mongo.getModule('dict');
const User = mongo.getModule('user');
const Att = mongo.getModule('att');

class BuildController {
  async build(req, res) {
    await mongo.buildCollection();
    res.send({
      code: 0,
      data: null
    });
  }

  async impData(req, res) {
    await Promise.all(cityData.map(async c => {
      const has = await AreaCode.countDocuments(c);
      if (has === 0) {
        const city = new AreaCode(c);
        await city.save();
      }
    }));
    await Dict.remove({type: 2, dict_code: null});
    await Promise.all(dictData.map(async d => {
      const has = await Dict.countDocuments(d);
      if (has === 0) {
        const dict = new Dict(d);
        await dict.save();
      }
    }));
    // 插入管理员
    const has = await User.countDocuments({role_id: 4});
    if (!has) {
      const att = new Att({
        path: '/uploads/admin.jpg'
      });
      const a = await att.save({new: true});
      const user = new User({
        username: '管理员',
        password: 'admin',
        mobile: 'admin',
        avatar: a._id,
        city_code: '4401',
        sex: 1,
        role_id: '4'
      });
      const u = await user.save({new: true});
      // 加密
      const saltPassword = `admin:${u._id}${config.salt}`;
      const ps = crypto.createHash('md5').update(saltPassword).digest('hex');
      await User.findOneAndUpdate({_id: u._id}, {password: ps});
    }
    res.send({code: 0, data: null});
  }
}

module.exports = new BuildController();
