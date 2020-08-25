const models = require('../models');
const Basket = models.Basket;

exports.findAll = (req, res) => {
  const documentId = req.params.documentId;
  const condition = { documentId: documentId };

  // setTimeout(() => {
    Basket.find(condition)
      .then((baskets) => {
        let filteredBaskets = [];

        baskets.forEach((basket) => {
          filteredBaskets.push({
            id: basket._id,
            basketNumber: basket.basketNumber,
            basketId: basket.basketId,
            startTime: basket.startTime,
            endTime: basket.endTime,
            durationTime: basket.durationTime(),
            trayQuantity: basket.trayQuantity,
            canQuantity: basket.canQuantity,
            rejectQuantity: basket.rejectQuantity,
            rejectKind: basket.rejectKind,
            seamingCondition: basket.seamingCondition,
            canMarkCondition: basket.canMarkCondition,
            indicatorCondition: basket.indicatorCondition,
          });
        });

        res.send(filteredBaskets);
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

  const basket = new Basket({
      documentId: documentId,
      basketNumber: req.body.basketNumber,
      basketId: req.body.basketId,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      trayQuantity: req.body.trayQuantity,
      canQuantity: req.body.canQuantity,
      rejectQuantity: req.body.rejectQuantity,
      rejectKind: req.body.rejectKind,
      seamingCondition: req.body.seamingCondition,
      canMarkCondition: req.body.canMarkCondition,
      indicatorCondition: req.body.indicatorCondition,
  });

  // setTimeout(() => {
    basket.save(basket)
      .then(() => {
        res.send({ message: 'basket was created successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.findOne = (req, res) => {
  const basketId = req.params.basketId;

  // setTimeout(() => {
    Basket.findById(basketId)
      .then((basket) => {
        if (basket) {
          res.send({
            id: basket._id,
            basketNumber: basket.basketNumber,
            basketId: basket.basketId,
            startTime: basket.startTime,
            endTime: basket.endTime,
            durationTime: basket.durationTime(),
            trayQuantity: basket.trayQuantity,
            canQuantity: basket.canQuantity,
            rejectQuantity: basket.rejectQuantity,
            rejectKind: basket.rejectKind,
            seamingCondition: basket.seamingCondition,
            canMarkCondition: basket.canMarkCondition,
            indicatorCondition: basket.indicatorCondition,
          });
        }
        else {
          res.status(404).send({ message: `basket with id ${basketId} not found` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.update = (req, res) => {
  const basketId = req.params.basketId;

  if (!req.body) {
    return res.status(400).send({ message: 'content could not be empty!' });
  }

  const newBasket = {
    basketNumber: req.body.basketNumber,
    basketId: req.body.basketId,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    trayQuantity: req.body.trayQuantity,
    canQuantity: req.body.canQuantity,
    rejectQuantity: req.body.rejectQuantity,
    rejectKind: req.body.rejectKind,
    seamingCondition: req.body.seamingCondition,
    canMarkCondition: req.body.canMarkCondition,
    indicatorCondition: req.body.indicatorCondition,
  };

  // setTimeout(() => {
    Basket.findByIdAndUpdate(basketId, newBasket, { useFindAndModify: false })
      .then((basket) => {
        if (basket) {
          res.send({ message: 'basket was updated successfully' });
        }
        else {
          res.status(404).send({ message: `cannot update basket with id ${basketId}` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};

exports.remove = (req, res) => {
  const basketId = req.params.basketId;

  // setTimeout(() => {
    Basket.findByIdAndDelete(basketId)
      .then((basket) => {
        if (basket) {
          res.send({ message: 'basket was removed successfully' });
        }
        else {
          res.status(404).send({ message: `cannot remove basket with id ${basketId}` });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  // }, 299);
};