const db = require('../models');
const Document = db.Document;

exports.create = (req, res) => {
  if (!req.body.productKind || !req.body.productionDate) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const document = new Document({
    productKind: req.body.productKind,
    productionDate: req.body.productionDate,
  });

  document.save(document)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while creating the document',
      });
    });
};

exports.findAll = (_, res) => {
  Document.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'some error occured while retrieving documents',
      });
    });
};