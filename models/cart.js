const fs = require(`fs`);
const path = require(`path`);
const p = path.join(
  path.dirname(process.mainModule.filename),
  `data`,
  `cart.json`
);

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductInd = cart.products.findIndex(
        (el) => el.productId === id
      );
      const existingProduct = cart.products[existingProductInd];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductInd] = updatedProduct;
      } else {
        updatedProduct = { productId: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + Number(price);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return err;
      }
      const updatedCart = { ...fileContent };
      const product = updatedCart.products.find((prod) => prod.id === id);
      const productquantity = product.quantity;
      updatedCart.totalPrice = updatedCart.totalPrice - productquantity * price;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.productId !== id
      );
    });
  }
};
