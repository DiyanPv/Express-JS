const Product = require(`../models/product`);
const Cart = require(`../models/cart`);
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log(rows);
      res.render("./shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        hasProducts: rows.length > 0,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("./shop/products", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCheckout = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./shop/cart", {
      prods: product,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./shop/orders", {
      prods: product,
      pageTitle: "Your orders",
      path: "/orders",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.getItemById(prodId, (product) => {
    res.render("./shop/product-details", {
      product: product,
      pageTitle: `Details Page`,
      path: "/product-details",
    });
  });
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getItemById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect(`/cart`);
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.productId
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postDeleteFromCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.getItemById(prodId, (product) => {
    console.log(prodId);
    Cart.deleteProduct(prodId, product.price);
  });

  res.redirect("/cart");
};
