// const getDb = require(`../util/database`).getDb;
// const mongoDb = require(`mongodb`);
const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: `User`,
  },
});

module.exports = mongoose.model(`Product`, productSchema);
