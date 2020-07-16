module.exports = (app) => {
  const controller = require('../controllers/document.controller.js');

  const express = require('express');
  var router = express.Router();

  router.get('/', controller.findAll);
  router.post('/', controller.create);

  router.get('/:id', controller.findOne);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  app.use('/api/document', router);
};