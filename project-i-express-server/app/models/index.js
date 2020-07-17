const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbConfig = require('../config/db.config.js');

const documentModel = require('./document.model.js');
const palletLoadModel = require('./pallet-load.model.js');
const palletModel = require('./pallet.model.js');
const basketUnloadModel = require('./basket-unload.model.js');
const basketModel = require('./basket.model.js');

module.exports = {
  mongoose: mongoose,
  url: dbConfig.url,
  Document: documentModel(mongoose),
  PalletLoad: palletLoadModel(mongoose),
  Pallet: palletModel(mongoose),
  BasketUnload: basketUnloadModel(mongoose),
  Basket: basketModel(mongoose),
};