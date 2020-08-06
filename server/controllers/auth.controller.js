var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const models = require("../models");
const User = models.User;

const config = require("../config/auth.config");

exports.signIn = (req, res) => {
  // setTimeout(() => {
    User.findOne({ username: req.body.username })
      .then((data) => {
        if (data) {
          if (bcrypt.compareSync(req.body.password, data.password)) {
            if (data.verified) {
              res.status(200).send({
                id: data.id,
                username: data.username,
                admin: data.admin,
                accessToken: jwt.sign({ id: data.id }, config.secret, {
                  expiresIn: 12 * 60 * 60,
                }),
              });
            }
            else {
              res.status(401).send({ message: 'unverified user' });
            }
          }
          else {
            res.status(404).send({ message: 'invalid password' });
          }
        }
        else {
          res.status(404).send({ message: 'user not found' });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while signing in user ${username}`,
        });
      });
  // }, 33);
};

exports.signUp = (req, res) => {
  // setTimeout(() => {
    User.findOne({ username: req.body.username })
      .then((data) => {
        if (data) {
          res.status(400).send({ message: "username is already in use" });
        }
        else {
          const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            verified: false,
            admin: false,
          });

          user.save(user)
            .then(() => {
              res.send({ message: 'user was signed up successfully' });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || 'some error occured while signing up the user',
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while signing up the user',
        });
      });
  // }, 33);
};