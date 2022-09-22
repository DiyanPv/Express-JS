const Product = require(`../models/product`);
const Cart = require(`../models/cart`);
exports.getShopPage = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./shop/shop", {
      prods: product,
      pageTitle: "Shop",
      path: "/",
      hasProducts: product.length > 0,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./shop/index", {
      prods: product,
      pageTitle: "Home Page",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./shop/cart", {
      prods: product,
      pageTitle: "Your Cart",
      path: "/cart",
    });
  });
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./shop/products", {
      prods: product,
      pageTitle: "Shop",
      path: "/products",
    });
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
      pageTitle: "Your Cart",
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
