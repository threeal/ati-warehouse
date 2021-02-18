const models = require("../models");
const ProductKind = models.ProductKind;

exports.findAll = (_, res) => {
  ProductKind.find()
    .then(productKinds => {
      let filteredProductKinds = [];

      productKinds.forEach(productKind => {
        filteredProductKinds.push({
          id: productKind._id,
          name: productKind.name,
          cansPerBasketTray: productKind.cansPerBasketTray,
          cansPerPalletLayer: productKind.cansPerPalletLayer,
          cansPerCase: productKind.cansPerCase
        });
      });

      res.send(filteredProductKinds);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "content could not be empty!" });
  }

  const productKind = new ProductKind({
    name: req.body.name,
    cansPerBasketTray: req.body.cansPerBasketTray,
    cansPerPalletLayer: req.body.cansPerPalletLayer,
    cansPerCase: req.body.cansPerCase
  });

  productKind
    .save(productKind)
    .then(() => {
      res.send({ message: "product kind was created successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.findOne = (req, res) => {
  const productKindId = req.params.productKindId;

  ProductKind.findById(productKindId)
    .then(productKind => {
      if (productKind) {
        res.send({
          id: productKind._id,
          name: productKind.name,
          cansPerBasketTray: productKind.cansPerBasketTray,
          cansPerPalletLayer: productKind.cansPerPalletLayer,
          cansPerCase: productKind.cansPerCase
        });
      } else {
        res.status(404).send({
          message: `product kind with id ${productKindId} not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const productKindId = req.params.productKindId;

  if (!req.body) {
    return res.status(400).send({ message: "content could not be empty!" });
  }

  let newProductKind = {
    name: req.body.name,
    cansPerBasketTray: req.body.cansPerBasketTray,
    cansPerPalletLayer: req.body.cansPerPalletLayer,
    cansPerCase: req.body.cansPerCase
  };

  ProductKind.findByIdAndUpdate(productKindId, newProductKind, {
    useFindAndModify: false
  })
    .then(productKind => {
      if (productKind) {
        res.send({ message: "product kind was updated successfully" });
      } else {
        res.status(404).send({
          message: `cannot update product kind with id ${productKindId}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.remove = (req, res) => {
  const productKindId = req.params.productKindId;

  ProductKind.findByIdAndDelete(productKindId)
    .then(productKind => {
      if (productKind) {
        res.send({ message: "product kind was removed successfully" });
      } else {
        res.status(404).send({
          message: `cannot remove product kind with id ${productKindId}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
