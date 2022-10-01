const express = require(`express`);
const { check, validationResult } = require(`express-validator`);
const router = express.Router();
const auth = require(`../controllers/auth`);
router.get(`/login`, auth.getLogin);
router.post(
  `/login`,
  [
    check(`email`).isEmail().withMessage(`Please enter a valid email!`),
    check(`password`, `Password should be at least 5 characters long`).isLength(
      { min: 5 }
    ),
  ],
  auth.postLogin
);
router.post(`/logout`, auth.postLogout);
router.get(`/signup`, auth.getSignup);
router.post(
  `/signup`,
  [
    check(`email`).isEmail().withMessage(`Please enter a valid email!`),
    check(
      `password`,
      `Please enter a valid password with at least 5 characters.`
    ).isLength({ min: 5 }),
  ],
  auth.postSignup
);

module.exports = router;
