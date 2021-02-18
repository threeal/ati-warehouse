module.exports = app => {
  const express = require("express");
  var router = express.Router();

  const controller = require("../controllers/auth.controller.js");

  router.post("/sign-in", controller.signIn);
  router.post("/sign-up", controller.signUp);

  app.use("/api/auth", router);
};
