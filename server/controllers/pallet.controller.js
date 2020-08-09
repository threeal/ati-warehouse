const models = require('../models');
const Pallet = models.Pallet;

exports.findAll = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  // setTimeout(() => {
    Pallet.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message ||
            `some error occured while retrieving pallets with document id ${documentId}`,
        });
      });
  // }, 299);
};

exports.create = (req, res) => {
  const documentId = req.params.documentId;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  const pallet = new Pallet({
      documentId: documentId,
      palletNumber: req.body.palletNumber,
      basketNumbers: req.body.basketNumbers,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      layerQuantity: req.body.layerQuantity,
      canQuantity: req.body.canQuantity,
      loader: req.body.loader,
      seamingCondition: req.body.seamingCondition,
      cleanCondition: req.body.cleanCondition,
      noRustCondition: req.body.noRustCondition,
      noOilyCondition: req.body.noOilyCondition,
      bottomPrintResult: req.body.bottomPrintResult,
      middlePrintResult: req.body.middlePrintResult,
      topPrintResult: req.body.topPrintResult,
      description: req.body.description,
  });

  // setTimeout(() => {
    pallet.save(pallet)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while creating pallet with document id ${documentId}`,
        });
      });
  // }, 299);
};

exports.findOne = (req, res) => {
  const palletId = req.params.palletId;

  // setTimeout(() => {
    Pallet.findById(palletId)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `pallet with id ${palletId} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while retrieving pallet with id ${palletId}`,
        });
      });
  // }, 299);
};

exports.update = (req, res) => {
  const palletId = req.params.palletId;

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }
  let newData = {
    palletNumber: req.body.palletNumber,
    basketNumbers: req.body.basketNumbers,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    layerQuantity: req.body.layerQuantity,
    canQuantity: req.body.canQuantity,
    loader: req.body.loader,
    seamingCondition: req.body.seamingCondition,
    cleanCondition: req.body.cleanCondition,
    noRustCondition: req.body.noRustCondition,
    noOilyCondition: req.body.noOilyCondition,
    bottomPrintResult: req.body.bottomPrintResult,
    middlePrintResult: req.body.middlePrintResult,
    topPrintResult: req.body.topPrintResult,
    description: req.body.description,
  };

  // setTimeout(() => {
    Pallet.findByIdAndUpdate(palletId, newData, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'pallet was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update pallet with id ${palletId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating pallet with id ${palletId}`,
        });
      });
  // }, 299);
};

exports.remove = (req, res) => {
  const palletId = req.params.palletId;

  // setTimeout(() => {
    Pallet.findByIdAndDelete(palletId)
      .then((data) => {
        if (data) {
          res.send({
            message: 'pallet was removed successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot remove pallet with id ${palletId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing pallet with id ${palletId}`,
        });
      });
  // }, 299);
};