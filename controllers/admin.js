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
  const product = new Product(title, image, description, price);
  product.save();
  res.redirect("/");
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
