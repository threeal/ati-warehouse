module.exports = (app) => {
  const controller = require('../controllers/pallet.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/:documentId/pallet/', controller.findAll);
  router.post('/:documentId/pallet/', controller.create);

  router.get('/:documentId/pallet/:palletId', controller.findOne);
  router.put('/:documentId/pallet/:palletId', controller.update);
  router.delete('/:documentId/pallet/:palletId', controller.remove);

  app.use('/api/document', router);
};