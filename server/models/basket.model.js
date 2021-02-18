module.exports = mongoose => {
  let schema = mongoose.Schema(
    {
      documentId: String,
      basketNumber: Number,
      basketId: Number,
      startTime: String,
      endTime: String,
      trayQuantity: Number,
      canQuantity: Number,
      rejectQuantity: Number,
      rejectKind: String,
      seamingCondition: Boolean,
      canMarkCondition: Boolean,
      indicatorCondition: Boolean
    },
    { timestamp: true }
  );

  schema.method("toJSON", function() {
    const { _id, ...object } = this.toObject();

    object.id = _id;
    object.durationTime = this.durationTime();

    return object;
  });

  schema.method("durationTime", function() {
    if (this.startTime) {
      if (this.endTime) {
        let duration =
          this.endTime.toTimeNumber() - this.startTime.toTimeNumber();
        return duration.toTimeInput();
      }
    }

    return null;
  });

  return mongoose.model("basket", schema);
};
