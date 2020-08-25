require('../../client/plugins/utility.js');

module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      documentId: String,
      palletNumber: Number,
      basketNumbers: [Number],
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
      remarks: String,
    },
    { timestamp: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;
    object.durationTime = this.durationTime();

    return object;
  });

  schema.method('durationTime', function() {
    if (this.startTime) {
      if (this.endTime) {
        let duration = this.endTime.toTimeNumber() - this.startTime.toTimeNumber();
        return duration.toTimeInput();
      }
    }

    return null;
  });

  return mongoose.model('pallet', schema);
};