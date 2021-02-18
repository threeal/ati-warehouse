module.exports = app => {
  const express = require("express");
  var router = express.Router();

  const { authJwt } = require("../middlewares");

  const controller = require("../controllers/pallet-load.controller.js");

  router.get(
    "/:documentId/pallet-load",
    [authJwt.verifyToken],
    controller.find
  );
  router.post(
    "/:documentId/pallet-load",
    [authJwt.verifyToken],
    controller.create
  );
  router.put(
    "/:documentId/pallet-load",
    [authJwt.verifyToken],
    controller.update
  );
  router.delete(
    "/:documentId/pallet-load",
    [authJwt.verifyToken],
    controller.remove
  );

  app.use("/api/document", router);
};
