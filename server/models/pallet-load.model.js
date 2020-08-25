const { Schema } = require("mongoose");

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

  return mongoose.model('pallet-load', schema);
};