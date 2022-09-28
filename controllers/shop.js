const Product = require(`../models/product`);
exports.getIndex = (req, res, next) => {
  Product.fetchAll().then((result) => {
    res.render("./shop/index", {
      prods: result,
      pageTitle: "Shop",
      path: "/",
      hasProducts: result.length > 0,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((result) => {
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
    .then((result) => console.log(result));
};

exports.getCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById();

  // res.render("shop/cart", {
  //   path: "/cart",
  //   pageTitle: "Your Cart",
  //   products: cartItems,
  // });
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
