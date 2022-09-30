const Product = require(`../models/product`);
const Order = require(`../models/order`);
exports.getIndex = (req, res, next) => {
  console.log(req.session.user);

  Product.find().then((result) => {
    res.render("./shop/index", {
      prods: result,
      pageTitle: "Shop",
      path: "/",
      isAuthenticated: req.session.isLoggedIn,

      hasProducts: result.length > 0,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.find().then((result) => {
    res.render("./shop/products", {
      prods: result,
      pageTitle: "Shop",
      isAuthenticated: req.session.isLoggedIn,

      path: "/products",
    });
  });
};
exports.getCheckout = (req, res, next) => {
  Product.find((product) => {
    res.render("./shop/cart", {
      prods: product,
      pageTitle: "Checkout",
      isAuthenticated: req.session.isLoggedIn,

      path: "/checkout",
    });
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render(`shop/orders`, {
      path: `/orders`,
      pageTitle: `Your Orders`,
      isAuthenticated: req.session.isLoggedIn,

      orders: orders,
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render(`shop/product-details`, {
        product: product,
        pageTitle: `Product Details`,
        isAuthenticated: req.session.isLoggedIn,

        path: `/products`,
      });
    })
    .catch((err) => console.log(err));
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect(`/cart`);
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.populate(`cart.items.productId`).then((user) => {
    const products = user.cart.items;
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      isAuthenticated: req.session.isLoggedIn,

      products: products,
    });
  });
};

exports.postDeleteFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user.removeFromCart(prodId).then((result) => {
    console.log(result);
    res.redirect("/cart");
  });
};

exports.postAddToOrder = (req, res, next) => {
  req.user
    .populate(`cart.items.productId`)
    .then((user) => {
      const products = user.cart.items.map((el) => {
        return { quantity: el.quantity, product: { ...el.productId._doc } };
      });

      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.session.user,
        },
      });
      return order.save();
    })
    .then((result) => {
      req.user.clearCart();
    })
    .then((result) => {
      res.redirect(`/orders`);
    })
    .catch((err) => console.log(err));
};
