const path = require("path");
const errorController = require(`./controllers/error`);
const express = require("express");
const bodyParser = require("body-parser");
// const sequelize = require(`./util/database`);
// const Product = require(`./models/product`);
// const Cart = require(`./models/cart`);
// const CartItem = require(`./models/cart-item`);
const User = require(`./models/user`);

// const Order = require(`./models/order`);
// const OrderItem = require(`./models/order-item`);

const mongoConnect = require(`./util/database`).mongoConnect;
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use((req, res, next) => {
  const id = `633491f36bd5b53e4a684fbd`;
  User.findById(id)
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .then((user) => {
      return user;
    })
    .catch((err) => console.log(err));
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoConnect(() => {
  app.listen(3000);
});
// Product.belongsTo(User, { constraints: true, onDelete: `CASCADE` });
// User.hasOne(Cart);
// User.hasMany(Product);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   .sync()
//   .then((result) => {
//     const user = User.findByPk(1);
//     return user;
//   })
//   .then((user) => {
//     if (!user) {
//       User.create({
//         id: 1,
//         name: "Diyan",
//         email: "diyan@nexo.io",
//       });
//     }
//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then((cart) => {
//
//   })
//   .catch((err) => err); SQL variant -> above is MongoDB
