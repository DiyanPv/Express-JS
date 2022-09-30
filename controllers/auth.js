const ObjectId = require(`mongodb`).ObjectId;
const User = require(`../models/user`);

exports.getLogin = (req, res, next) => {
  res.render(`auth/login`, {
    path: `/login`,
    isAuthenticated: req.session.isLoggedIn,

    pageTitle: `Login`,
  });
};

exports.postLogin = (req, res, next) => {
  const id = `63356176a076e0de1536dac1`;
  User.findById(id)
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => err);
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect(`/`);
  });
};
