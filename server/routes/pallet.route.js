module.exports = (app) => {
  const express = require('express');
  var router = express.Router();

  const { authJwt } = require('../middlewares');

  const controller = require('../controllers/pallet.controller.js');

  router.get('/:documentId/pallet/', [ authJwt.verifyToken ], controller.findAll);
  router.post('/:documentId/pallet/', [ authJwt.verifyToken ], controller.create);

  router.get('/:documentId/pallet/:palletId', [ authJwt.verifyToken ], controller.findOne);
  router.put('/:documentId/pallet/:palletId', [ authJwt.verifyToken ], controller.update);
  router.delete('/:documentId/pallet/:palletId', [ authJwt.verifyToken ], controller.remove);

  app.use('/api/document', router);
};