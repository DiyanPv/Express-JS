const ObjectId = require(`mongodb`).ObjectId;
const User = require(`../models/user`);
const bcrypt = require(`bcryptjs`);
exports.getLogin = (req, res, next) => {
  res.render(`auth/login`, {
    path: `/login`,
    isAuthenticated: req.session.isLoggedIn,

    pageTitle: `Login`,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect(`/login`);
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect(`/`);
            });
          }
          res.redirect(`/login`);
        })
        .catch((err) => {
          res.redirect(`/login`);
        });
    })
    .catch((err) => err);
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect(`/`);
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpass = req.body.confirmpassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect(`/signup`);
      }
      return bcrypt.hash(password, 12).then((hashPass) => {
        if (password == confirmpass) {
          const user = new User({
            name: `Static`,
            email: email,
            password: hashPass,
            cart: { items: [] },
          });
          return user.save();
        }

        return null;
      });
    })

    .then((result) => {
      if (result) {
        return res.redirect(`/login`);
      }
      return res.redirect(`signup`);
    })
    .catch((err) => console.log(err));
};
exports.getSignup = (req, res, next) => {
  res.render(`auth/signup`, {
    path: `/signup`,
    isAuthenticated: req.session.isLoggedIn,
    pageTitle: `Create Account`,
  });
};
