module.exports = (app) => {
  const express = require('express');
  var router = express.Router();

  const { authJwt } = require('../middlewares');

  const controller = require('../controllers/product-kind.controller.js');

  router.get('/', [ authJwt.verifyToken ], controller.findAll);
  router.post('/', [ authJwt.verifyToken ], controller.create);

  router.get('/:productKindId', [ authJwt.verifyToken ], controller.findOne);
  router.put('/:productKindId', [ authJwt.verifyToken ], controller.update);
  router.delete('/:productKindId', [ authJwt.verifyToken ], controller.remove);

  app.use('/api/product-kind', router);
};