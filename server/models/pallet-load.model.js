const { Schema } = require("mongoose");

require('../../client/plugins/utility.js');

module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      documentId: String,
      loadDate: String,
      brand: String,
    },
    { timestamp: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.method('layerQuantity', function(pallets) {
    let quantity = 0;

    if (pallets) {
      pallets.forEach((pallet) => {
        if (pallet.layerQuantity) {
          quantity += pallet.layerQuantity;
        }
      });
    }

    return quantity;
  });

  schema.method('canQuantity', function(pallets) {
    let quantity = 0;

    if (pallets) {
      pallets.forEach((pallet) => {
        if (pallet.canQuantity) {
          quantity += pallet.canQuantity;
        }
      });
    }

    return quantity;
  });

  schema.method('totalCan', function(pallets, productKind) {
    let total = this.canQuantity(pallets);

    if (productKind) {
      if (productKind.cansPerPalletLayer) {
        total += this.layerQuantity(pallets) * productKind.cansPerPalletLayer;
      }
    }

    return total;
  });

  schema.method('totalDuration', function(pallets) {
    let total = 0;

    if (pallets) {
      pallets.forEach((pallet) => {
        let duration = pallet.durationTime();
        total += (duration) ? duration.toTimeNumber() : 0;
      });
    }

    return total.toTimeInput();
  });

  schema.method('averageDuration', function(pallets) {
    if (pallets) {
      if (pallets.length > 0) {
        let totalDuration = this.totalDuration(pallets).toTimeNumber();
        let averageDuration = totalDuration / pallets.length;

        return averageDuration.toTimeInput();
      }
    }

    return null;
  });

  schema.method('totalCase', function(pallets, productKind) {
    if (productKind) {
      if (productKind.cansPerCase > 0) {
        let total = this.totalCan(pallets, productKind);
        return Math.floor(total / productKind.cansPerCase);
      }
    }

    return null;
  });

  schema.method('totalCasePerHour', function(pallets, productKind) {
    let duration = this.totalDuration(pallets).toTimeNumber();
    if (duration > 0) {
      let total = this.totalCase(pallets, productKind);
      let hours = duration / 60;
      return Math.floor(total / hours);
    }

    return null;
  });

  return mongoose.model('pallet-load', schema);
};