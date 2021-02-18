module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      name: String,
      productKindId: String,
      productionDate: String,
    },
    { timestamp: true },
  );

  schema.method('toJSON', function() {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.method('totalBasketUnloadCan', function(baskets, productKind) {
    let total = 0;

    if (baskets) {
      if (productKind) {
        if (productKind.cansPerBasketTray) {
          baskets.forEach((basket) => {
            if (basket.trayQuantity) {
              total += basket.trayQuantity * productKind.cansPerBasketTray;
            }
          });
        }
      }

      baskets.forEach((basket) => {
        if (basket.canQuantity) {
          total += basket.canQuantity;
        }
      });
    }

    return total;
  });


  schema.method('totalPalletLoadCan', function(pallets, productKind) {
    let total = 0;

    if (pallets) {
      if (productKind) {
        if (productKind.cansPerPalletLayer) {
          pallets.forEach((pallet) => {
            if (pallet.layerQuantity) {
              total += pallet.layerQuantity * productKind.cansPerPalletLayer;
            }
          });
        }
      }

      pallets.forEach((pallet) => {
        if (pallet.canQuantity) {
          total += pallet.canQuantity;
        }
      });
    }

    return total;
  });

  schema.method('deltaTotalCan', function(baskets, pallets, productKind) {
    let totalBasketUnloadCan = this.totalBasketUnloadCan(baskets, productKind);
    let totalPalletLoadCan = this.totalPalletLoadCan(pallets, productKind);

    return totalPalletLoadCan - totalBasketUnloadCan;
  });

  return mongoose.model('document', schema);
};