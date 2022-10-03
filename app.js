const path = require("path");
const errorController = require(`./controllers/error`);
const mongoose = require(`mongoose`);
const express = require("express");
const bodyParser = require("body-parser");
const multer = require(`multer`);
const User = require(`./models/user`);
const authRoutes = require(`./routes/auth`);
const session = require(`express-session`);
const MonboDBStore = require(`connect-mongodb-session`)(session);
const flash = require(`connect-flash`);
const csrf = require(`csurf`);
const { v4: uuidv4 } = require("uuid");
const csrfProtection = csrf();
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
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `images`);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
    cb(null, uuidv4() + file.originalname);
  },
});

const fileFilters = (req, file, cb) => {
  if (
    file.mimetype === `image/png` ||
    file.mimetype === `image/jpg` ||
    file.mimetype === `image/jpeg`
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilters }).single(`image`)
);
app.use(express.static(path.join(__dirname, "public")));
app.use("\\images", express.static(path.join(__dirname, "images")));

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
app.use(csrfProtection);

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

app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || null;
  res.locals.csrfToken = req.csrfToken() || null;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);
