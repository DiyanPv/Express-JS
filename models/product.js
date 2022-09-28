const getDb = require(`../util/database`).getDb;
const mongoDb = require(`mongodb`);
class Product {
  constructor(title, price, description, image, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
    this.userId = userId;
  }
  save() {
    const db = getDb();
    return db
      .collection(`products`)
      .insertOne(this)
      .then((res) => res)
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection(`products`)
      .find()
      .toArray()
      .then((res) => res)
      .catch((err) => console.log(err));
  }

  static findById(id) {
    id = id.trim();
    console.log(id);
    const objectId = mongoDb.ObjectId(id);
    const db = getDb();
    return db
      .collection(`products`)
      .find({ _id: objectId })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {});
  }

  static updateProduct(id, title, price, image, description) {
    const db = getDb();
    const objectId = mongoDb.ObjectId(id);
    return db.collection(`products`).replaceOne(
      { _id: objectId },
      {
        title: title,
        price: price,
        image: image,
        description: description,
      }
    );
  }

  static deleteOne(id) {
    const db = getDb();
    const objectId = mongoDb.ObjectId(id);
    return db.collection(`products`).deleteOne({ _id: objectId });
  }
}

module.exports = Product;
