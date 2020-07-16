const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbConfig = require('../config/db.config.js');

const tutorialsModel = require('./tutorial.model.js');
const documentModel = require('./document.model.js');
const palletLoadModel = require('./pallet-load.model.js');
const basketUnloadModel = require('./basket-unload.model.js');

module.exports = {
  mongoose: mongoose,
  url: dbConfig.url,
  tutorials: tutorialsModel(mongoose),
  Document: documentModel(mongoose),
  PalletLoad: palletLoadModel(mongoose),
  BasketUnload: basketUnloadModel(mongoose),
};