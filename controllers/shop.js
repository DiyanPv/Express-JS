const Product = require(`../models/product`);
const Order = require(`../models/order`);
exports.getIndex = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((result) => {
    res.render("./shop/index", {
      prods: result,
      pageTitle: "Shop",
      path: "/",
      hasProducts: result.length > 0,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((result) => {
    res.render("./shop/products", {
      prods: result,
      pageTitle: "Shop",
      path: "/products",
    });
  });
};
exports.getCheckout = (req, res, next) => {
  Product.find((product) => {
    res.render("./shop/cart", {
      prods: product,
      pageTitle: "Checkout",

      path: "/checkout",
    });
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render(`shop/orders`, {
      path: `/orders`,
      pageTitle: `Your Orders`,

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
  if (!req.session.isLoggedIn) {
    return res.redirect(`/login`);
  }
  const prodId = req.body.productId;
  req.user.populate(`cart.items.productId`).then((user) => {
    const products = user.cart.items;
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",

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
          email: req.user.email,
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
