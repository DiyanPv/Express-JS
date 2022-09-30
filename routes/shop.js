const path = require("path");
const shopController = require(`../controllers/shop`);
const express = require("express");
const isAuth = require(`../middleware/isAuth`);

const adminData = require("./admin");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", isAuth, shopController.getCart);
router.get("/checkout", isAuth, shopController.getCheckout);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/products/:productId", shopController.getProductDetails);
router.post("/add-to-cart", isAuth, shopController.addToCart);
router.post(`/cart-delete-item`, isAuth, shopController.postDeleteFromCart);
router.post(`/create-order`, isAuth, shopController.postAddToOrder);

module.exports = router;
