const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbConfig = require('../config/db.config.js');

const tutorials = require('./tutorial.model.js');

module.exports = {
  mongoose: mongoose,
  url: dbConfig.url,
  tutorials: tutorials(mongoose),
};