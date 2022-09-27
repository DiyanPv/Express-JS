const Product = require(`../models/product`);
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
  req.user.getOrders({ include: [`products`] }).then((data) => {
    console.log(data);
    res.render(`shop/orders`, {
      path: `/orders`,
      pageTitle: `Your Orders`,
      orders: data,
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
  let fetchedCart;
  req.user.getCart().then((cart) => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } }).then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      let newQuantity = 1;
      if (product) {
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
      }
      return Product.findByPk(prodId)
        .then((product) => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .catch((err) => console.log(err))
        .then(() => {
          res.redirect(`/cart`);
        })
        .catch((err) => console.log(err));
    });
  });
};

exports.getCart = (req, res, next) => {
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.productId
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({
  //           productData: product,
  //           qty: cartProductData.qty,
  //         });
  //       }
  //     }
  //   });
  // }); DEPRACATED

  req.user.getCart().then((cart) => {
    return cart
      .getProducts()
      .then((cartItems) => {
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartItems,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postDeleteFromCart = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((res) => res.redirect(`/cart`))
    .catch((err) => console.log(err));

  res.redirect("/cart");
};

exports.postAddToOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then((result) => {
          return fetchedCart.setProducts(null);
        })
        .then((result) => {
          res.redirect(`/orders`);
        });
    })
    .catch((err) => console.log(err));
};
