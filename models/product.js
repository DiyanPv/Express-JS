const getDb = require(`../util/database`).getDb;
class Product {
  constructor(title, price, description, image) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.image = image;
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
}

module.exports = Product;
