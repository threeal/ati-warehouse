module.exports = (app) => {
  const controller = require('../controllers/document.controller.js');

  const express = require('express');
  var router = express.Router();

  router.post('/', controller.create);
  router.get('/', controller.findAll);

  app.use('/api/document', router);
};