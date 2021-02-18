module.exports = app => {
  const express = require("express");
  var router = express.Router();

  const { authJwt } = require("../middlewares");

  const controller = require("../controllers/basket.controller.js");

  router.get("/:documentId/basket/", [authJwt.verifyToken], controller.findAll);
  router.post("/:documentId/basket/", [authJwt.verifyToken], controller.create);

  router.get(
    "/:documentId/basket/:basketId",
    [authJwt.verifyToken],
    controller.findOne
  );
  router.put(
    "/:documentId/basket/:basketId",
    [authJwt.verifyToken],
    controller.update
  );
  router.delete(
    "/:documentId/basket/:basketId",
    [authJwt.verifyToken],
    controller.remove
  );

  app.use("/api/document", router);
};
