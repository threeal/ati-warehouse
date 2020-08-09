const models = require('../models');
const ProductKind = models.ProductKind;
const Document = models.Document;
const PalletLoad = models.PalletLoad;
const Pallet = models.Pallet;
const BasketUnload = models.BasketUnload;
const Basket = models.Basket;

exports.findAll = (_, res) => {
  // setTimeout(() => {
    ProductKind.find()
      .then((productKinds) => {
        Document.find()
        .then((documents) => {
          let data = [];

          documents.forEach((document, index) => {
            let productKind = productKinds.find(o => o.id === document.productKindId);
            data.push({
              id: document._id,
              name: document.name,
              productKindId: document.productKindId,
              productKind: (productKind) ? productKind.name : null,
              productionDate: document.productionDate,
            });
          });

          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: err.message || 'some error occured while retrieving documents',
          });
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while retrieving documents',
        });
      });
  // }, 299);
};

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const document = new Document({
    name: req.body.name,
    productKindId: req.body.productKindId,
    productionDate: req.body.productionDate,
  });

  // setTimeout(() => {
    document.save(document)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while creating the document',
        });
      });
  // }, 299);
};

exports.findOne = (req, res) => {
  const documentId = req.params.documentId;

  // setTimeout(() => {
    Document.findById(documentId)
      .then((document) => {
        if (document) {
          ProductKind.findById(document.productKindId)
            .then((productKind) => {
              res.send({
                id: document._id,
                name: document.name,
                productKindId: document.productKindId,
                productKind: (productKind) ? productKind.name : null,
                productionDate: document.productionDate,
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message
                  || 'some error occured while retrieving product kind with id'
                  + `${productKindId}`,
              });
            });
        }
        else {
          res.status(404).send({
            message: `document with id ${documentId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while retrieving document with id ${documentId}`,
        });
      });
  // }, 299);
};

exports.update = (req, res) => {
  const documentId = req.params.documentId;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  let newData = {
    name: req.body.name,
    productKindId: req.body.productKindId,
    productionDate: req.body.productionDate,
  };

  // setTimeout(() => {
    Document.findByIdAndUpdate(documentId, newData, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'document was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update document with id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating document with id ${documentId}`,
        });
      });
  // }, 299);
};

exports.remove = (req, res) => {
  const documentId = req.params.documentId;

  // setTimeout(() => {
    Document.findByIdAndDelete(documentId)
      .then((data) => {
        if (data) {
          const condition = {
            documentId: { $regex: new RegExp(documentId), $options: 'i' }
          };

          PalletLoad.deleteMany(condition)
            .then(() => {
              Pallet.deleteMany(condition)
                .then(() => {
                  BasketUnload.deleteMany(condition)
                    .then(() => {
                      Basket.deleteMany(condition)
                        .then(() => {
                          res.send({
                            message: 'document was removed successfully',
                          });
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message: err.message
                              || `some error occured while removing basket with document id ${documentId}`,
                          });
                        });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message: err.message
                          || `some error occured while removing basket unload with document id ${documentId}`,
                      });
                    });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message
                      || `some error occured while removing pallet with document id ${documentId}`,
                  });
                });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message
                  || `some error occured while removing pallet load with document id ${documentId}`,
              });
            });
        }
        else {
          res.status(404).send({
            message: `cannot remove document with id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing document with id ${documentId}`,
        });
      });
  // }, 299);
};