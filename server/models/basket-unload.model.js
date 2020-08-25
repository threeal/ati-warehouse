module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      documentId: String,
      unloadDate: String,
      line: String,
    },
    { timestamp: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.method('trayQuantity', function(baskets) {
    let quantity = 0;

    if (baskets) {
      baskets.forEach((basket) => {
        if (basket.trayQuantity) {
          quantity += basket.trayQuantity;
        }
      });
    }

    return quantity;
  });

  schema.method('canQuantity', function(baskets) {
    let quantity = 0;

    if (baskets) {
      baskets.forEach((basket) => {
        if (basket.canQuantity) {
          quantity += basket.canQuantity;
        }
      });
    }

    return quantity;
  });

  schema.method('totalCan', function(baskets, productKind) {
    let total = this.canQuantity(baskets);

    if (productKind) {
      if (productKind.cansPerBasketTray) {
        total += this.trayQuantity(baskets) * productKind.cansPerBasketTray;
      }
    }

    return total;
  });

  return mongoose.model('basket-unload', schema);
};