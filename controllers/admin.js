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

  req.user
    .createProduct({ title, image, description, price })
    .then((result) => {
      res.redirect(`/products`);
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then((result) => {
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

  req.user
    .getProducts({ where: { id: prodId } })
    .then((result) => {
      const product = result[0];
      console.log(product);
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
  Product.findByPk(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.image = updatedImageUrl;
      product.description = updatedDesc;
      product.save();
      res.redirect("/admin/products");
    })
    .catch((err) => err);
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log(`Destroyed Product`);
      res.redirect("/admin/products");
    })
    .catch((err) => err);
};
