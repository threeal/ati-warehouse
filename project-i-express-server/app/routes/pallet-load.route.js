module.exports = (app) => {
  const controller = require('../controllers/pallet-load.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/:documentId/pallet-load', controller.find);
  router.post('/:documentId/pallet-load', controller.create);
  router.put('/:documentId/pallet-load', controller.update);
  router.delete('/:documentId/pallet-load', controller.remove);

  app.use('/api/document', router);
};