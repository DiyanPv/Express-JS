const ObjectId = require(`mongodb`).ObjectId;
const User = require(`../models/user`);
const nodemailer = require(`nodemailer`);
const sendGridTransport = require(`nodemailer-sendgrid-transport`);
const bcrypt = require(`bcryptjs`);
exports.getLogin = (req, res, next) => {
  let message = req.flash(`error`);
  if (message.length <= 0) {
    message = null;
  }
  res.render(`auth/login`, {
    path: `/login`,
    error: message,
    pageTitle: `Login`,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash(`error`, `Incorrect Email or Password`);

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
          req.flash(`error`, `Incorrect Email or Password`);
          res.redirect(`/login`);
        })
        .catch((err) => {
          req.flash(`error`, `Incorrect Email or Password`);

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
        req.flash(`error`, `User already exists!`);
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
      return res.redirect(`/signup`);
    })
    .then((result) => console.log(`Redirected`))
    .catch((err) => console.log(err));
};
exports.getSignup = (req, res, next) => {
  let message = req.flash(`error`);
  if (message.length <= 0) {
    message = null;
  }
  res.render(`auth/signup`, {
    path: `/signup`,
    error: message,

    pageTitle: `Create Account`,
  });
};
