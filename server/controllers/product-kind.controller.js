const models = require('../models');
const ProductKind = models.ProductKind;

exports.findAll = (_, res) => {
  // setTimeout(() => {
    ProductKind.find()
      .then((productKinds) => {
        let filteredProductKinds = [];

        productKinds.forEach((productKind) => {
          filteredProductKinds.push({
            id: productKind._id,
            name: productKind.name,
            cansPerBasketTray: productKind.cansPerBasketTray,
            cansPerPalletLayer: productKind.cansPerPalletLayer,
          });
        });

        res.send(filteredProductKinds);
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

  const productKind = new ProductKind({
    name: req.body.name,
    cansPerBasketTray: req.body.cansPerBasketTray,
    cansPerPalletLayer: req.body.cansPerPalletLayer,
  });

  // setTimeout(() => {
    productKind.save(productKind)
      .then(() => {
        res.send({ message: 'product kind was created successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.findOne = (req, res) => {
  const productKindId = req.params.productKindId;

  // setTimeout(() => {
    ProductKind.findById(productKindId)
      .then((productKind) => {
        if (productKind) {
          res.send({
            id: productKind._id,
            name: productKind.name,
            cansPerBasketTray: productKind.cansPerBasketTray,
            cansPerPalletLayer: productKind.cansPerPalletLayer,
          });
        }
        else {
          res.status(404).send({
            message: `product kind with id ${productKindId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.update = (req, res) => {
  const productKindId = req.params.productKindId;

  if (!req.body) {
    return res.status(400).send({ message: 'content could not be empty!' });
  }

  let newProductKind = {
    name: req.body.name,
    cansPerBasketTray: req.body.cansPerBasketTray,
    cansPerPalletLayer: req.body.cansPerPalletLayer,
  };

  // setTimeout(() => {
    ProductKind.findByIdAndUpdate(productKindId, newProductKind,
        { useFindAndModify: false })
      .then((productKind) => {
        if (productKind) {
          res.send({ message: 'product kind was updated successfully' });
        }
        else {
          res.status(404).send({
            message: `cannot update product kind with id ${productKindId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.remove = (req, res) => {
  const productKindId = req.params.productKindId;

  // setTimeout(() => {
    ProductKind.findByIdAndDelete(productKindId)
      .then((productKind) => {
        if (productKind) {
          res.send({ message: 'product kind was removed successfully' });
        }
        else {
          res.status(404).send({
            message: `cannot remove product kind with id ${productKindId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};