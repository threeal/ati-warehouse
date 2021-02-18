module.exports = app => {
  const express = require("express");
  var router = express.Router();

  const { authJwt } = require("../middlewares");

  const controller = require("../controllers/document.controller.js");

  router.get("/", [authJwt.verifyToken], controller.findAll);
  router.post("/", [authJwt.verifyToken], controller.create);

  router.get("/:documentId", [authJwt.verifyToken], controller.findOne);
  router.put("/:documentId", [authJwt.verifyToken], controller.update);
  router.delete("/:documentId", [authJwt.verifyToken], controller.remove);

  app.use("/api/document", router);
};
