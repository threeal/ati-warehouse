const models = require('../models');
const PalletLoad = models.PalletLoad;
const Pallet = models.Pallet;

exports.find = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  // setTimeout(() => {
    PalletLoad.findOne(condition)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `pallet load with document id ${documentId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while retrieving pallet load with document id ${documentId}`,
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

  const palletLoad = new PalletLoad({
    documentId: req.params.documentId,
    loadDate: req.body.loadDate,
    brand: req.body.brand,
  });

  // setTimeout(() => {
    palletLoad.save(palletLoad)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while creating the pallet load',
        });
      });
  // }, 33);
};

exports.update = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  // setTimeout(() => {
    PalletLoad.findOneAndUpdate(condition, req.body, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'pallet load was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update pallet load with document id ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating pallet load with document id ${documentId}`,
        });
      });
  // }, 33);
};

exports.remove = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  // setTimeout(() => {
    PalletLoad.deleteMany(condition)
      .then((data) => {
        if (data) {
          Pallet.deleteMany(condition)
            .then(() => {
              res.send({
                message: 'pallet load was removed successfully',
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message
                  || `some error occured while removing pallet with document id ${documentId}`,
              });
            });
        }
        else {
          res.status(404).send({
            message: `cannot remove pallet load with documentId ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing pallet load with document id ${documentId}`,
        });
      });
  // }, 33);
};