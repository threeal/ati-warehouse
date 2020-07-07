module.exports = (app) => {
  const controller = require('../controllers/tutorial.controller.js');

  const express = require('express');
  var router = express.Router();

  router.post('/', controller.create);
  router.get('/', controller.findAll);
  router.get('/published', controller.findAllPublished);
  router.get('/:id', controller.findOne);
  router.put('/:id', controller.update);
  router.delete('/', controller.deleteAll);
  router.delete('/:id', controller.delete);

  app.use('/api/tutorials', router);
};