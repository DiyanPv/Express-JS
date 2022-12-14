const Product = require(`../models/product`);
const Order = require(`../models/order`);
const fs = require(`fs`);
const PDFDocument = require(`pdfkit`);
const ITEMS_PER_PAGE = 2;
exports.getIndex = (req, res, next) => {
  const page = Number(req.query.page) || 1;
  let totalItems;

  Product.find()
    .count()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: Number(page),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = Number(req.query.page) || 1;

  Product.find()
    .count()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/products", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: page,
      });
    });
};
exports.getCheckout = (req, res, next) => {
  // const prodId = req.body.productId;
  // req.user.populate(`cart.items.productId`).then((user) => {
  //   const products = user.cart.items;
  //   res.render("shop/cart", {
  //     path: "/cart",

  const prodId = req.body.productId;
  req.user.populate(`cart.items.productId`).then((user) => {
    console.log(user);
    const products = user.cart.items;
    let total = 0;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });
    res.render("shop/checkout", {
      path: "checkout",
      pageTitle: "Checkout",
      totalSum: total,
      products: products,
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
      res.render(`shop/product-details`, {
        product: product,
        pageTitle: `Product Details`,

        path: `/products`,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
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

  req.user.removeFromCart(prodId).then((result) => {
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });
      pdfDoc.text("---");
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch((err) => next(err));
};
