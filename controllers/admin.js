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
  const product = new Product(null, title, image, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((product) => {
    res.render("./admin/products", {
      prods: product,
      pageTitle: "Shop",
      path: "/admin/products",
    });
  });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect(`/`);
  }
  const prodId = req.params.productId;
  Product.getItemById(prodId, (product) => {
    console.log(product);
    res.render("./admin/edit-product", {
      pageTitle: "Edit Product",
      path: `none`,
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.image;
  console.log(updatedImageUrl);
  console.log(updatedTitle);
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.deletebyId(prodId);
  res.redirect("/admin/products");
};
