module.exports = mongoose => {
  let schema = mongoose.Schema(
    {
      name: String,
      cansPerBasketTray: Number,
      cansPerPalletLayer: Number,
      cansPerCase: Number
    },
    { timestamp: true }
  );

  schema.method("toJSON", function() {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("product-kind", schema);
};
