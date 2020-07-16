module.exports = (app) => {
  const controller = require('../controllers/pallet-load.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/:id', controller.find);
  router.post('/:id', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  app.use('/api/pallet-load', router);
};