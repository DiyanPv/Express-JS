const path = require("path");

const isAuth = require(`../middleware/isAuth`);

const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);
router.post(`/edit-product`, isAuth, adminController.postEditProduct);
router.post(`/delete-product`, isAuth, adminController.postDeleteProduct);

router.get(`/edit-product/:productId`, adminController.getEditProduct);
module.exports = router;
