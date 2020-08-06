module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      documentId: String,
      palletNumber: String,
      basketNumbers: [String],
      startTime: String,
      endTime: String,
      layerQuantity: Number,
      canQuantity: Number,
      loader: String,
      seamingCondition: Boolean,
      cleanCondition: Boolean,
      noRustCondition: Boolean,
      noOilyCondition: Boolean,
      bottomPrintResult: Boolean,
      middlePrintResult: Boolean,
      topPrintResult: Boolean,
    },
    { timestamp: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model('pallet', schema);
};