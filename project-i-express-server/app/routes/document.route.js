module.exports = (app) => {
  const controller = require('../controllers/document.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/', controller.findAll);
  router.post('/', controller.create);

  router.get('/:documentId', controller.findOne);
  router.put('/:documentId', controller.update);
  router.delete('/:documentId', controller.remove);

  app.use('/api/document', router);
};