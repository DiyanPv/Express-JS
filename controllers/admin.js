const Product = require(`../models/product`);

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  //deprecated version
  // const product = new Product(null, title, image, description, price);
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  //MYSQL

  console.log(image);
  if (!image) {
    return res.status(500).redirect(`/admin/add-product`);
  }
  const product = new Product({
    title: title,
    image: image.path,
    description: description,
    price: price,
    userId: req.user,
  });
  product.save().then((result) => {
    res.redirect(`/products`);
  });
};

exports.getProducts = (req, res, next) => {
  Product.find().then((result) => {
    res.render("./admin/products", {
      prods: result,
      pageTitle: "Shop",
      path: "/admin/products",
    });
  });
  // Product.fetchAll((product) => {
  //   res.render("./admin/products", {
  //     prods: product,
  //     pageTitle: "Shop",
  //     path: "/admin/products",
  //   });
  // }); DEPRECATED
};
exports.getEditProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect(`/login`);
  }
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect(`/`);
  }
  const prodId = req.params.productId;
  // Product.getItemById(prodId, (product) => {
  //   console.log(product);
  //   res.render("./admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: `none`,
  //     editing: editMode,
  //     product: product,
  //   });
  // }); DEPRECATED
  Product.findById(prodId).then((product) => {
    res.render("./admin/edit-product", {
      pageTitle: "Edit Product",
      path: `none`,
      editing: editMode,

      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect(`/login`);
  }

  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.file;
  const updatedDesc = req.body.description;
  Product.findById(productId).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect(`/`);
    }
    if (image) {
      product.imageUrl = image.path;
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    return product.save().then(res.redirect(`/admin/products`));
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  return Product.deleteOne({ _id: prodId, userId: req.user._id }).then(
    (result) => {
      res.redirect(`/admin/products`);
    }
  );
  // Product.findByIdAndRemove(prodId).then((result) => {
  //   res.redirect(`/products`);
  // });
};
