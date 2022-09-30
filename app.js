const path = require("path");
const errorController = require(`./controllers/error`);
const mongoose = require(`mongoose`);
const express = require("express");
const bodyParser = require("body-parser");
const User = require(`./models/user`);
const authRoutes = require(`./routes/auth`);
const session = require(`express-session`);
const MonboDBStore = require(`connect-mongodb-session`)(session);

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const MongoDB_URI = `mongodb+srv://peter:88888888@cluster.4rlz1th.mongodb.net/shop`;
const store = new MonboDBStore({
  uri: MongoDB_URI,
  collection: `sessions`,
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: `my secret`,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // console.log(req.session.user);
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

mongoose.connect(MongoDB_URI).then((result) => {
  User.findOne()
    .then((user) => {
      if (!user) {
        const user = new User({
          name: `Diyan`,
          email: `diyan@abv.bg`,
          password: "123",
          cart: {
            items: [],
          },
        });
        return user.save();
      }
    })
    .then((result) => {
      app.listen(3000);
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);
