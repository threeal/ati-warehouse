const models = require('../models');
const Pallet = models.Pallet;

exports.findAll = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: { $regex: new RegExp(documentId), $options: 'i' } };

  // setTimeout(() => {
    Pallet.find(condition)
      .then((pallets) => {
        let filteredPallets = [];

        pallets.forEach((pallet) => {
          filteredPallets.push({
            id: pallet._id,
            palletNumber: pallet.palletNumber,
            basketNumbers: pallet.basketNumbers,
            startTime: pallet.startTime,
            endTime: pallet.endTime,
            layerQuantity: pallet.layerQuantity,
            canQuantity: pallet.canQuantity,
            loader: pallet.loader,
            seamingCondition: pallet.seamingCondition,
            cleanCondition: pallet.cleanCondition,
            noRustCondition: pallet.noRustCondition,
            noOilyCondition: pallet.noOilyCondition,
            bottomPrintResult: pallet.bottomPrintResult,
            middlePrintResult: pallet.middlePrintResult,
            topPrintResult: pallet.topPrintResult,
            description: pallet.description,
          });
        });

        res.send(filteredPallets);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.create = (req, res) => {
  const documentId = req.params.documentId;

  if (!req.body) {
    return res.status(400).send({ message: 'content could not be empty!' });
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
      .then(() => {
        res.send({ message: 'pallet was created successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.findOne = (req, res) => {
  const palletId = req.params.palletId;

  // setTimeout(() => {
    Pallet.findById(palletId)
      .then((pallet) => {
        if (pallet) {
          res.send({
            id: pallet._id,
            palletNumber: pallet.palletNumber,
            basketNumbers: pallet.basketNumbers,
            startTime: pallet.startTime,
            endTime: pallet.endTime,
            layerQuantity: pallet.layerQuantity,
            canQuantity: pallet.canQuantity,
            loader: pallet.loader,
            seamingCondition: pallet.seamingCondition,
            cleanCondition: pallet.cleanCondition,
            noRustCondition: pallet.noRustCondition,
            noOilyCondition: pallet.noOilyCondition,
            bottomPrintResult: pallet.bottomPrintResult,
            middlePrintResult: pallet.middlePrintResult,
            topPrintResult: pallet.topPrintResult,
            description: pallet.description,
          });
        }
        else {
          res.status(404).send({ message: `pallet with id ${palletId} not found` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
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

  let newPallet = {
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
    Pallet.findByIdAndUpdate(palletId, newPallet, { useFindAndModify: false })
      .then((pallet) => {
        if (pallet) {
          res.send({ message: 'pallet was updated successfully' });
        }
        else {
          res.status(404).send({ message: `cannot update pallet with id ${palletId}` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.remove = (req, res) => {
  const palletId = req.params.palletId;

  // setTimeout(() => {
    Pallet.findByIdAndDelete(palletId)
      .then((pallet) => {
        if (pallet) {
          res.send({ message: 'pallet was removed successfully' });
        }
        else {
          res.status(404).send({ message: `cannot remove pallet with id ${palletId}` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};