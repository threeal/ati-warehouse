module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      documentId: String,
      basketNumber: String,
      basketId: String,
      startTime: String,
      endTime: String,
      trayQuantity: Number,
      canQuantity: Number,
      rejectQuantity: Number,
      rejectKind: String,
      seamingCondition: Boolean,
      canMarkCondition: Boolean,
      indicatorCondition: Boolean,
    },
    { timestamp: true },
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model('basket', schema);
};