const models = require('../models');
const PalletLoad = models.PalletLoad;

exports.find = (req, res) => {
  const id = req.params.id;
  const condition = { documentId: { $regex: new RegExp(id), $options: 'i' } };

  setTimeout(() => {
    PalletLoad.findOne(condition)
      .then((data) => {
        if (data) {
          res.send(data);
        }
        else {
          res.status(404).send({
            message: `pallet load with documentId ${id} not found`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while retrieving pallet load with documentId ${id}`,
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

  const palletLoad = new PalletLoad({
    documentId: req.params.id,
    loadDate: req.body.loadDate,
    brand: req.body.brand,
  });

  setTimeout(() => {
    palletLoad.save(palletLoad)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'some error occured while creating the pallet load',
        });
      });
  }, 1000);
};

exports.update = (req, res) => {
  const id = req.params.id;
  const condition = { documentId: { $regex: new RegExp(id), $options: 'i' } };

  if (!req.body) {
    return res.status(400).send({
      message: 'content could not be empty!',
    });
  }

  setTimeout(() => {
    PalletLoad.findOneAndUpdate(condition, req.body, { useFindAndModify: false })
      .then((data) => {
        if (data) {
          res.send({
            message: 'pallet load was updated successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot update pallet load with documentId ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while updating pallet load with documentId ${id}`,
        });
      });
  }, 1000);
};

exports.remove = (req, res) => {
  const id = req.params.id;
  const condition = { documentId: { $regex: new RegExp(id), $options: 'i' } };

  setTimeout(() => {
    PalletLoad.findOneAndRemove(condition)
      .then((data) => {
        if (data) {
          res.send({
            message: 'pallet load was removed successfully',
          });
        }
        else {
          res.status(404).send({
            message: `cannot remove pallet load with documentId ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
            || `some error occured while removing pallet load with documentId ${id}`,
        });
      });
  }, 1000);
};