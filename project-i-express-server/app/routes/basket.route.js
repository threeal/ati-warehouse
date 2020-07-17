module.exports = (app) => {
  const controller = require('../controllers/basket.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/:documentId/basket/', controller.findAll);
  router.post('/:documentId/basket/', controller.create);

  router.get('/:documentId/basket/:basketId', controller.findOne);
  router.put('/:documentId/basket/:basketId', controller.update);
  router.delete('/:documentId/basket/:basketId', controller.remove);

  app.use('/api/document', router);
};