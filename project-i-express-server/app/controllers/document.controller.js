const db = require('../models');
const Document = db.Document;

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
  }, 3000);
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
  }, 3000);
};

exports.findOne = (req, res) => {
  setTimeout(() => {
    Document.findById(req.params.id)
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
  }, 3000);
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  setTimeout(() => {
    Document.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
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
  }, 3000);
};

exports.delete = (req, res) => {
  setTimeout(() => {
    Document.findByIdAndRemove(req.params.id)
      .then((data) => {
        if (data) {
          res.send({
            message: 'document was deleted successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot delete document with id ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || `some error occured while deleting document with id ${id}`,
        });
      });
  }, 3000);
};