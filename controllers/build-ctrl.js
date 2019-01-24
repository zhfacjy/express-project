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
    await AreaCode.remove({});
    await Promise.all(cityData.map(async c => {
      const city = new AreaCode(c);
      await city.save();
    }));
    await Dict.remove({});
    await Promise.all(dictData.map(async d => {
      const dict = new Dict(d);
      await dict.save();
    }));
    res.send({code: 0, data: null});
  }
}

module.exports = new BuildController();
