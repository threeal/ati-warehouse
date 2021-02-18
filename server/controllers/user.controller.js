const bcrypt = require("bcryptjs");

const models = require("../models");
const User = models.User;

exports.findAll = (req, res) => {
  User.find()
    .then(users => {
      let filteredUsers = [];

      users.forEach(user => {
        if (user._id != req.userId) {
          filteredUsers.push({
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            verified: user.verified,
            admin: user.admin
          });
        }
      });

      res.send(filteredUsers);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.findOne = (req, res) => {
  const userId = req.params.userId;

  if (userId === req.userId || req.admin) {
    User.findById(userId)
      .then(user => {
        if (user) {
          res.send({
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            verified: user.verified,
            admin: user.admin
          });
        } else {
          res.status(404).send({ message: `user with id ${userId} not found` });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(403).send({ message: "require admin role" });
  }
};

exports.verify = (req, res) => {
  const userId = req.params.userId;

  if (!req.body) {
    return res.status(400).send({
      message: "content could not be empty!"
    });
  }

  let newUser = {
    verified: true
  };

  User.findByIdAndUpdate(userId, newUser, { useFindAndModify: false })
    .then(user => {
      if (user) {
        res.send({ message: "user was verified successfully" });
      } else {
        res.status(404).send({
          message: `cannot verify user with id ${userId}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.promoteAdmin = (req, res) => {
  const userId = req.params.userId;

  if (!req.body) {
    return res.status(400).send({
      message: "content could not be empty!"
    });
  }

  let newUser = {
    admin: true
  };

  User.findByIdAndUpdate(userId, newUser, { useFindAndModify: false })
    .then(user => {
      if (user) {
        res.send({ message: "user was promoted as admin successfully" });
      } else {
        res.status(404).send({
          message: `cannot promote user with id ${userId} as admin`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.demoteAdmin = (req, res) => {
  const userId = req.params.userId;

  if (!req.body) {
    return res.status(400).send({
      message: "content could not be empty!"
    });
  }

  let newUser = {
    verified: false
  };

  User.findByIdAndUpdate(userId, newUser, { useFindAndModify: false })
    .then(user => {
      if (user) {
        res.send({ message: "user was demoted from admin successfully" });
      } else {
        res.status(404).send({
          message: `cannot demote user with id ${userId} from admin`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updatePassword = (req, res) => {
  const userId = req.params.userId;

  if (!req.body) {
    return res.status(400).send({
      message: "content could not be empty!"
    });
  }

  if (userId === req.userId || req.admin) {
    let newUser = {
      password: bcrypt.hashSync(req.body.password, 8)
    };

    User.findByIdAndUpdate(userId, newUser, { useFindAndModify: false })
      .then(user => {
        if (user) {
          res.send({ message: "user password was updated successfully" });
        } else {
          res.status(404).send({
            message: `cannot update user password with id ${userId}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(403).send({ message: "require admin role" });
  }
};

exports.remove = (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndDelete(userId)
    .then(user => {
      if (user) {
        res.send({ message: "user was removed successfully" });
      } else {
        res
          .status(404)
          .send({ message: `cannot remove user with id ${userId}` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
