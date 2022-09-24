const fs = require(`fs`);
const path = require(`path`);
const p = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  `cart.json`
);

module.exports = class Cart {
  static addProduct(id, productPrice) {}

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return err;
      }

      const updatedCart = { ...JSON.parse(fileContent) };

      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productquantity = product.qty;
      if (updatedCart.totalPrice >= 0) {
        updatedCart.totalPrice =
          updatedCart.totalPrice - productquantity * price;
      }

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
