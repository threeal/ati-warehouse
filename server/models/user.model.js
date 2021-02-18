module.exports = mongoose => {
  let schema = mongoose.Schema(
    {
      username: String,
      fullname: String,
      password: String,
      verified: Boolean,
      admin: Boolean
    },
    { timestamp: true }
  );

  schema.method("toJSON", function() {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("user", schema);
};
