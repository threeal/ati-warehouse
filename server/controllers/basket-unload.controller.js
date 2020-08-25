const models = require('../models');
const { model } = require('mongoose');
const ProductKind = models.ProductKind;
const Document = models.Document;
const BasketUnload = models.BasketUnload;
const Basket = models.Basket;

exports.find = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: documentId };

  // setTimeout(() => {
    BasketUnload.findOne(condition)
      .then((basketUnload) => {
        if (basketUnload) {
          Document.findById(documentId)
            .then((document) => {
              ProductKind.findById((document) ? document.productKindId : '')
                .then((productKind) => {
                  Basket.find(condition)
                    .then((baskets) => {
                      res.send({
                        unloadDate: basketUnload.unloadDate,
                        line: basketUnload.line,
                        trayQuantity: basketUnload.trayQuantity(baskets),
                        canQuantity: basketUnload.canQuantity(baskets),
                        totalCan: basketUnload.totalCan(baskets, productKind),
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
            message: `basket unload with document id ${documentId} not found`,
          });
        }
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

  const basketUnload = new BasketUnload({
    documentId: req.params.documentId,
    unloadDate: req.body.unloadDate,
    line: req.body.line,
  });

  // setTimeout(() => {
    basketUnload.save(basketUnload)
      .then(() => {
        res.send({ message: 'basket unload was created successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.update = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: documentId };

  if (!req.body) {
    return res.status(400).send({ message: 'content could not be empty!' });
  }

  const newBasketUnload = {
    unloadDate: req.body.unloadDate,
    line: req.body.line,
  };

  // setTimeout(() => {
    BasketUnload.findOneAndUpdate(condition, newBasketUnload, { useFindAndModify: false })
      .then((basketUnload) => {
        if (basketUnload) {
          res.send({ message: 'basket unload was updated successfully' });
        }
        else {
          res.status(404).send({
            message: `cannot update basket unload with document id ${documentId}`,
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
  const condition = { documentId: documentId };

  // setTimeout(() => {
    BasketUnload.deleteMany(condition)
      .then((basketUnload) => {
        if (basketUnload) {
          Basket.deleteMany(condition)
            .then(() => {
              res.send({ message: 'basket unload was removed successfully' });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        }
        else {
          res.status(404).send({
            message: `cannot remove basket unload with document id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};