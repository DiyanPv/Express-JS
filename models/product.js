const fs = require(`fs`);
const path = require(`path`);
const Cart = require(`./cart`);
const p = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  `products.json`
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};
module.exports = class Product {
  constructor(productId, title, imageUrl, description, price) {
    this.title = title;
    (this.image = imageUrl),
      (this.description = description),
      (this.price = price),
      (this.productId = productId);
  }
  save() {
    getProductsFromFile((products) => {
      if (this.productId) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.productId === this.productId
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.productId = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static getItemById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.productId == id);
      cb(product);
    });
  }

  static deletebyId(id) {
    getProductsFromFile((products) => {
      const updatedProduct = products.filter((p) => p.productId !== id);
      const product = products.find((prod) => prod.productId == id);
      fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
        if (!err) {
          Cart.deleteProduct(product.productId, product.price);
        }
      });
    });
  }
};
