const Product = require(`../models/product`);
const getDb = require(`../util/database`).getDb;
exports.getAddProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.body.image;
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

  const product = new Product(title, price, description, image, req.user._id);
  product.save().then((result) => {
    res.redirect(`/products`);
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((result) => {
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
  Product.findById(prodId)
    .then((product) => {
      res.render("./admin/edit-product", {
        pageTitle: "Edit Product",
        path: `none`,
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.image;
  const updatedDesc = req.body.description;

  Product.updateProduct(
    productId,
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDesc
  ).then(res.redirect(`/products`));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne(prodId).then((result) => {
    res.redirect(`/products`);
  });
};
