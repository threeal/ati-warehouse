const db = require('../models');
const Tutorial = db.tutorials;

exports.create = (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published || false,
  });

  tutorial.save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while creating the tutorial',
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;

  const condition = (title)
    ? { title: { $regex: new RegExp(title), $options: 'i' } }
    : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while retrieving tutorials',
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (data) {
        res.send(data);
      }
      else {
        res.status(404).send({
          message: `tutorial with id ${id} not found`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `some error occured while retrieving tutorial with id ${id}`,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'data could not be empty!',
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.send({
          message: 'tutorial was updated successfully',
        });
      }
      else {
        res.status(404).send({
          message: `cannot update tutorial with id ${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `some error occured while updating tutorial with id ${id}`,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id)
    .then((data) => {
      if (data) {
        res.send({
          message: 'tutorial was deleted successfully',
        });
      }
      else {
        res.status(404).send({
          message: `cannot delete tutorial with id ${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `some error occured while deleting tutorial with id ${id}`,
      });
    });
};

exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} tutorials were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while deleting all tutorials',
      });
    });
};

exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while retrieving published tutorials',
      });
    });
};