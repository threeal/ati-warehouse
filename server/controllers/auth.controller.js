const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const models = require("../models");
const User = models.User;

const config = require("../config/auth.config");

exports.signIn = (req, res) => {
  let username = req.body.username;
  const condition = { username: username };

  // setTimeout(() => {
    User.findOne(condition)
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            if (user.verified) {
              res.status(200).send({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                admin: user.admin,
                accessToken: jwt.sign({ id: user.id }, config.secret, {
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
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.signUp = (req, res) => {
  const username = req.body.username;
  const condition = { username: username };

  // setTimeout(() => {
    User.findOne(condition)
      .then((user) => {
        if (user) {
          res.status(400).send({ message: "username is already in use" });
        }
        else {
          const newUser = new User({
            username: req.body.username,
            fullname: req.body.fullname,
            password: bcrypt.hashSync(req.body.password, 8),
            verified: false,
            admin: false,
          });

          newUser.save(newUser)
            .then(() => {
              res.send({ message: 'user was signed up successfully' });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};