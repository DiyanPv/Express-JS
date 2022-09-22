const Product = require(`../models/product`);

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
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
      hasProducts: product.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
exports.getEditProduct = (req, res, next) => {
  res.render("./admin/edit-product", {
    pageTitle: "Add Product",
    path: `none`,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};
