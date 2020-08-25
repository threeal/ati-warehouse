const models = require('../models');
const ProductKind = models.ProductKind;
const Document = models.Document;
const PalletLoad = models.PalletLoad;
const Pallet = models.Pallet;

exports.find = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: documentId };

  // setTimeout(() => {
    PalletLoad.findOne(condition)
      .then((palletLoad) => {
        if (palletLoad) {
          Document.findById(documentId)
            .then((document) => {
              ProductKind.findById((document) ? document.productKindId : '')
                .then((productKind) => {
                  Pallet.find(condition)
                    .then((pallets) => {
                      res.send({
                        loadDate: palletLoad.loadDate,
                        brand: palletLoad.brand,
                        layerQuantity: palletLoad.layerQuantity(pallets),
                        canQuantity: palletLoad.canQuantity(pallets),
                        totalCan: palletLoad.totalCan(pallets, productKind),
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
            message: `pallet load with document id ${documentId} not found`,
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

  const palletLoad = new PalletLoad({
    documentId: req.params.documentId,
    loadDate: req.body.loadDate,
    brand: req.body.brand,
  });

  // setTimeout(() => {
    palletLoad.save(palletLoad)
      .then(() => {
        res.send({ message: 'pallet load was created successfully' });
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

  const newPalletLoad = {
    loadDate: req.body.loadDate,
    brand: req.body.brand,
  };

  // setTimeout(() => {
    PalletLoad.findOneAndUpdate(condition, newPalletLoad, { useFindAndModify: false })
      .then((palletLoad) => {
        if (palletLoad) {
          res.send({ message: 'pallet load was updated successfully' });
        }
        else {
          res.status(404).send({
            message: `cannot update pallet load with document id ${documentId}`,
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
    PalletLoad.deleteMany(condition)
      .then((palletLoad) => {
        if (palletLoad) {
          Pallet.deleteMany(condition)
            .then(() => {
              res.send({ message: 'pallet load was removed successfully' });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        }
        else {
          res.status(404).send({
            message: `cannot remove pallet load with documentId ${documentId}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};