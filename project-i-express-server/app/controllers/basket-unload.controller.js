const models = require('../models');
const BasketUnload = models.BasketUnload;
const Basket = models.Basket;

exports.find = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  setTimeout(() => {
    BasketUnload.findOne(condition)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `basket unload with document id ${documentId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while retrieving basket unload with document id ${documentId}`,
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

  const basketUnload = new BasketUnload({
    documentId: req.params.documentId,
    unloadDate: req.body.unloadDate,
    line: req.body.line,
  });

  setTimeout(() => {
    basketUnload.save(basketUnload)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while creating the basket unload',
        });
      });
  }, 1000);
};

exports.update = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  setTimeout(() => {
    BasketUnload.findOneAndUpdate(condition, req.body, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'basket unload was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update basket unload with document id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating basket unload with document id ${documentId}`,
        });
      });
  }, 1000);
};

exports.remove = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  setTimeout(() => {
    BasketUnload.deleteMany(condition)
      .then((data) => {
        if (data) {
          Basket.deleteMany(condition)
            .then(() => {
              res.send({
                message: 'basket unload was removed successfully',
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message
                  || `some error occured while removing basket with document id ${documentId}`,
              });
            });
        }
        else {
          res.status(404).send({
            message: `cannot remove basket unload with document id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing basket unload with document id ${documentId}`,
        });
      });
  }, 1000);
};