const getDb = require(`../util/database`).getDb;
const mongo = require(`mongodb`);
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection(`users`).insertOne(this);
  }

  static findById(id) {
    const objectId = mongo.ObjectId(id);
    const db = getDb();
    return db.collection(`users`).find({ _id: objectId }).next();
  }

  addToCart(product) {
    const objectId = mongo.ObjectId(product._id);
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: objectId,
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    console.log(updatedCart);
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: objectId }, { $set: { cart: updatedCart } });
  }
}

module.exports = User;
