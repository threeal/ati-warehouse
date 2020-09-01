const models = require('../models');
const ProductKind = models.ProductKind;
const Document = models.Document;
const PalletLoad = models.PalletLoad;
const Pallet = models.Pallet;
const BasketUnload = models.BasketUnload;
const Basket = models.Basket;

exports.findAll = (req, res) => {
  let documentCondition = {};
  if (req.query.productionDate) {
    documentCondition = {
      productionDate: { $regex: new RegExp(req.query.productionDate) },
    };
  }

  // setTimeout(() => {
    ProductKind.find()
      .then((productKinds) => {
        Document.find(documentCondition)
        .then((documents) => {
          let filteredDocuments = [];

          documents.forEach((document) => {
            let productKind = productKinds.find(o => o.id === document.productKindId);
            filteredDocuments.push({
              id: document._id,
              name: document.name,
              productKindId: document.productKindId,
              productKind: (productKind) ? productKind.name : null,
              productionDate: document.productionDate,
            });
          });

          res.send(filteredDocuments);
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'content could not be empty!' });
  }

  const document = new Document({
    name: req.body.name,
    productKindId: req.body.productKindId,
    productionDate: req.body.productionDate,
  });

  // setTimeout(() => {
    document.save(document)
      .then(() => {
        res.send({ message: 'document was created successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
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
              let condition = { documentId: documentId };

              Basket.find(condition)
                .then((baskets) => {
                  Pallet.find(condition)
                    .then((pallets) => {
                      res.send({
                        id: document._id,
                        name: document.name,
                        productKindId: document.productKindId,
                        productKind: (productKind) ? productKind.name : null,
                        productionDate: document.productionDate,
                        totalBasketUnloadCan: document.totalBasketUnloadCan(
                            baskets, productKind),
                        totalPalletLoadCan: document.totalPalletLoadCan(
                            pallets, productKind),
                        deltaTotalCan: document.deltaTotalCan(
                            baskets, pallets, productKind),
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({ message: err.message });
                    });
                })
                .catch((err) => {
                  res.status(500).send({ message: err.message });
                });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        }
        else {
          res.status(404).send({ message: `document with id ${documentId} not found` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.update = (req, res) => {
  const documentId = req.params.documentId;

  if (!req.body) {
    return res.status(400).send({ message: 'content could not be empty!' });
  }

  let newDocument = {
    name: req.body.name,
    productKindId: req.body.productKindId,
    productionDate: req.body.productionDate,
  };

  // setTimeout(() => {
    Document.findByIdAndUpdate(documentId, newDocument, { useFindAndModify: false })
      .then((document) => {
        if (document) {
          res.send({ message: 'document was updated successfully' });
        }
        else {
          res.status(404).send({
            message: `cannot update document with id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.remove = (req, res) => {
  const documentId = req.params.documentId;

  // setTimeout(() => {
    Document.findByIdAndDelete(documentId)
      .then((document) => {
        if (document) {
          const condition = { documentId: documentId };

          PalletLoad.deleteMany(condition)
            .then(() => {
              Pallet.deleteMany(condition)
                .then(() => {
                  BasketUnload.deleteMany(condition)
                    .then(() => {
                      Basket.deleteMany(condition)
                        .then(() => {
                          res.send({ message: 'document was removed successfully' });
                        })
                        .catch((err) => {
                          res.status(500).send({ message: err.message });
                        });
                    })
                    .catch((err) => {
                      res.status(500).send({ message: err.message });
                    });
                })
                .catch((err) => {
                  res.status(500).send({ message: err.message });
                });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        }
        else {
          res.status(404).send({
            message: `cannot remove document with id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};