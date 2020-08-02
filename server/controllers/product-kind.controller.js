const models = require('../models');
const ProductKind = models.ProductKind;

exports.findAll = (_, res) => {
  // setTimeout(() => {
    ProductKind.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while retrieving product kinds',
        });
      });
  // }, 33);
};

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const productKind = new ProductKind({
    name: req.body.name,
  });

  // setTimeout(() => {
    productKind.save(productKind)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while creating the product kind',
        });
      });
  // }, 33);
};

exports.findOne = (req, res) => {
  const productKindId = req.params.productKindId;

  // setTimeout(() => {
    ProductKind.findById(productKindId)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `product kind with id ${productKindId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || 'some error occured while retrieving product kind with id'
            + `${productKindId}`,
        });
      });
  // }, 33);
};

exports.update = (req, res) => {
  const productKindId = req.params.productKindId;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  let newData = {
    name: req.body.name,
  };

  // setTimeout(() => {
    ProductKind.findByIdAndUpdate(productKindId, newData, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'product kind was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update product kind with id ${productKindId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating product kind with id ${productKindId}`,
        });
      });
  // }, 33);
};

exports.remove = (req, res) => {
  const productKindId = req.params.productKindId;

  // setTimeout(() => {
    ProductKind.findByIdAndDelete(productKindId)
      .then((data) => {
        if (data) {
          res.send({
            message: 'product kind was removed successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot remove product kind with id ${productKindId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing product kind with id ${productKindId}`,
        });
      });
  // }, 33);
};