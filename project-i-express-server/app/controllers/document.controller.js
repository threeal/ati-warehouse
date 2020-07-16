const models = require('../models');
const Document = models.Document;

exports.findAll = (_, res) => {
  setTimeout(() => {
    Document.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while retrieving documents',
        });
      });
  }, 1000);
};

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const document = new Document({
    productKind: req.body.productKind,
    productionDate: req.body.productionDate,
  });

  setTimeout(() => {
    document.save(document)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while creating the document',
        });
      });
  }, 1000);
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  setTimeout(() => {
    Document.findById(id)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `document with id ${id} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || `some error occured while retrieving document with id ${id}`,
        });
      });
  }, 1000);
};

exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  setTimeout(() => {
    Document.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'document was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update document with id ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || `some error occured while updating document with id ${id}`,
        });
      });
  }, 1000);
};

exports.remove = (req, res) => {
  const id = req.params.id;

  setTimeout(() => {
    Document.findByIdAndRemove(id)
      .then((data) => {
        if (data) {
          res.send({
            message: 'document was removed successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot remove document with id ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || `some error occured while removing document with id ${id}`,
        });
      });
  }, 1000);
};