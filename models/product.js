const Cart = require(`./cart`);
const db = require(`../util/database`);
module.exports = class Product {
  constructor(productId, title, imageUrl, description, price) {
    this.title = title;
    (this.image = imageUrl),
      (this.description = description),
      (this.price = price),
      (this.productId = productId);
  }
  save() {
    return db.execute(
      `INSERT INTO products (title,price,description,image) VALUES (?, ?, ?, ?)`,
      [this.title, this.price, this.description, this.image]
    );
  }
  static fetchAll(cb) {
    return db.execute(`SELECT * FROM products`);
  }
  static getItemById(id, cb) {}

  static deletebyId(id) {}
};
