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
