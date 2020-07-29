const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const models = require('../models');
const User = models.User;

exports.verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'unauthorized' });
      }
      else {
        req.userId = decoded.id;

        User.findById(req.userId)
          .then((data) => {
            if (data.verified) {
              next();
            }
            else {
              res.status(401).send({ message: 'user has not been verified' });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || 'some error occured while verifying the user',
            });
          });
      }
    });
  }
  else {
    res.status(401).send({ message: 'no token provided' });
  }
};

exports.isVerified = (req, res, next) => {
};

exports.isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .then((data) => {
      if (data.admin) {
        next();
      }
      else {
        res.status(403).send({ message: 'require admin role' });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while verifying the user',
      });
    });
};