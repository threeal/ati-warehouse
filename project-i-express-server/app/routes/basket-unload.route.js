module.exports = (app) => {
  const express = require('express');
  var router = express.Router();

  const { authJwt } = require('../middlewares');

  const controller = require('../controllers/basket-unload.controller.js');

  router.get('/:documentId/basket-unload', [ authJwt.verifyToken ], controller.find);
  router.post('/:documentId/basket-unload', [ authJwt.verifyToken ], controller.create);
  router.put('/:documentId/basket-unload', [ authJwt.verifyToken ], controller.update);
  router.delete('/:documentId/basket-unload', [ authJwt.verifyToken ], controller.remove);

  app.use('/api/document', router);
};