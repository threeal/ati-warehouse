const jwt = require("jsonwebtoken");

const models = require("../models");
const User = models.User;

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (token) {
    jwt.verify(token, "somesecret", (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "unauthorized access" });
      } else {
        req.userId = decoded.id;

        User.findById(req.userId)
          .then(user => {
            if (user.verified) {
              req.admin = user.admin;
              next();
            } else {
              res.status(401).send({ message: "user has not been verified" });
            }
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      }
    });
  } else {
    res.status(401).send({ message: "no token provided" });
  }
};

exports.isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (user.admin) {
        next();
      } else {
        res.status(403).send({ message: "require admin role" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
