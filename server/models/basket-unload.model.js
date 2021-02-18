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
    const { _id, ...object } = this.toObject();
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

  schema.method('rejectQuantity', function(baskets) {
    let quantity = 0;

    if (baskets) {
      baskets.forEach((basket) => {
        if (basket.rejectQuantity) {
          quantity += basket.rejectQuantity;
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

  schema.method('totalDuration', function(baskets) {
    let total = 0;

    if (baskets) {
      baskets.forEach((basket) => {
        let duration = basket.durationTime();
        total += (duration) ? duration.toTimeNumber() : 0;
      });
    }

    return total.toTimeInput();
  });

  schema.method('averageDuration', function(baskets) {
    if (baskets) {
      if (baskets.length > 0) {
        let totalDuration = this.totalDuration(baskets).toTimeNumber();
        let averageDuration = totalDuration / baskets.length;

        return averageDuration.toTimeInput();
      }
    }

    return null;
  });

  schema.method('totalCase', function(baskets, productKind) {
    if (productKind) {
      if (productKind.cansPerCase > 0) {
        let total = this.totalCan(baskets, productKind);
        return Math.floor(total / productKind.cansPerCase);
      }
    }

    return null;
  });

  schema.method('casePerHour', function(baskets, productKind) {
    let duration = this.totalDuration(baskets).toTimeNumber();
    if (duration > 0) {
      let total = this.totalCase(baskets, productKind);
      let hours = duration / 60;
      return Math.floor(total / hours);
    }

    return null;
  });

  return mongoose.model('basket-unload', schema);
};