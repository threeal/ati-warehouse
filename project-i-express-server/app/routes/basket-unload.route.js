module.exports = (app) => {
  const controller = require('../controllers/basket-unload.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/:documentId/basket-unload', controller.find);
  router.post('/:documentId/basket-unload', controller.create);
  router.put('/:documentId/basket-unload', controller.update);
  router.delete('/:documentId/basket-unload', controller.remove);

  app.use('/api/document', router);
};