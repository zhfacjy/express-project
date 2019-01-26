const mongo = require('../utils/mongo-util');
const cityData = require('../utils/cityData');
const dictData = require('../utils/dictData');

const AreaCode = mongo.getModule('areaCode');
const Dict = mongo.getModule('dict');

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
      const has = await AreaCode.countDocuments(d);
      if (has === 0) {
        const city = new AreaCode(c);
        await city.save();
      }
    }));
    await Promise.all(dictData.map(async d => {
      const has = await Dict.countDocuments(d);
      if (has === 0) {
        const dict = new Dict(d);
        await dict.save();
      }
    }));
    res.send({code: 0, data: null});
  }
}

module.exports = new BuildController();
