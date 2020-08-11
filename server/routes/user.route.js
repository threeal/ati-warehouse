module.exports = (app) => {
  const express = require('express');
  var router = express.Router();

  const { authJwt } = require('../middlewares');

  const controller = require('../controllers/user.controller.js');

  router.get('/', [ authJwt.verifyToken, authJwt.isAdmin ], controller.findAll);

  router.get('/:userId', [ authJwt.verifyToken ], controller.findOne);
  router.post('/:userId/verify', [ authJwt.verifyToken, authJwt.isAdmin ],
      controller.verify);
  router.post('/:userId/admin', [ authJwt.verifyToken, authJwt.isAdmin ],
      controller.promoteAdmin);
  router.delete('/:userId/admin', [ authJwt.verifyToken, authJwt.isAdmin ],
      controller.demoteAdmin);
  router.put('/:userId/password', [ authJwt.verifyToken ], controller.updatePassword);
  router.delete('/:userId', [ authJwt.verifyToken, authJwt.isAdmin ], controller.remove);

  app.use('/api/user', router);
};