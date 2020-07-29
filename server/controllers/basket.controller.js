const models = require('../models');
const Basket = models.Basket;

exports.findAll = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  // setTimeout(() => {
    Basket.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message ||
            `some error occured while retrieving baskets with document id ${documentId}`,
        });
      });
  // }, 33);
};

exports.create = (req, res) => {
  const documentId = req.params.documentId;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const basket = new Basket({
      documentId: documentId,
      basketNumber: req.body.basketNumber,
      basketId: req.body.basketId,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      basketQuantity: req.body.basketQuantity,
      canQuantity: req.body.canQuantity,
      rejectQuantity: req.body.rejectQuantity,
      rejectKind: req.body.rejectKind,
  });

  // setTimeout(() => {
    basket.save(basket)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while creating basket with document id ${documentId}`,
        });
      });
  // }, 33);
};

exports.findOne = (req, res) => {
  const basketId = req.params.basketId;

  // setTimeout(() => {
    Basket.findById(basketId)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `basket with id ${basketId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while retrieving basket with id ${basketId}`,
        });
      });
  // }, 33);
};

exports.update = (req, res) => {
  const basketId = req.params.basketId;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  // setTimeout(() => {
    Basket.findByIdAndUpdate(basketId, req.body, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'basket was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update basket with id ${basketId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating basket with id ${basketId}`,
        });
      });
  // }, 33);
};

exports.remove = (req, res) => {
  const basketId = req.params.basketId;

  // setTimeout(() => {
    Basket.findByIdAndDelete(basketId)
      .then((data) => {
        if (data) {
          res.send({
            message: 'basket was removed successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot remove basket with id ${basketId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing basket with id ${basketId}`,
        });
      });
  // }, 33);
};