const Product = require(`../models/product`);
const Cart = require(`../models/cart`);
exports.getIndex = (req, res, next) => {
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("./shop/index", {
  //       prods: rows,
  //       pageTitle: "Shop",
  //       path: "/",
  //       hasProducts: rows.length > 0,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   }); DEPRECATED approach
  Product.findAll().then((result) => {
    res.render("./shop/index", {
      prods: result,
      pageTitle: "Shop",
      path: "/",
      hasProducts: result.length > 0,
    });
  });
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("./shop/products", {
  //       prods: rows,
  //       pageTitle: "Shop",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   }); DEPRECATED APPROACH
  Product.findAll().then((result) => {
    res.render("./shop/products", {
      prods: result,
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
  // Product.fetchAll((product) => {
  //   res.render("./shop/orders", {
  //     prods: product,
  //     pageTitle: "Your orders",
  //     path: "/orders",
  //   });
  // });

  Product.findAll().then((result) => {
    res.render("./shop/orders", {
      prods: result,
      pageTitle: "Your orders",
      path: "/orders",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findByPk(prodId)
    .then((data) => {
      console.log(data);
      res.render("./shop/product-details", {
        product: data,
        pageTitle: `Details Page`,
        path: "/product-details",
      });
    })
    .catch((err) => {
      console.log(err);
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
    Cart.deleteProduct(prodId, product.price);
  });

  res.redirect("/cart");
};
