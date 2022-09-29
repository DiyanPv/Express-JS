const path = require("path");
const errorController = require(`./controllers/error`);
const mongoose = require(`mongoose`);
const express = require("express");
const bodyParser = require("body-parser");

const User = require(`./models/user`);

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use((req, res, next) => {
  const id = `63356176a076e0de1536dac1`;
  User.findById(id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoose
  .connect(
    `mongodb+srv://peter:88888888@cluster.4rlz1th.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: `Diyan`,
          email: `diyan@abv.bg`,
          cart: {
            items: [],
          },
        });
        return user.save();
      }
      return user;
    });
  })
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
