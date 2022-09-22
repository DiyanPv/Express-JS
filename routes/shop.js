const path = require("path");
const shopController = require(`../controllers/shop`);
const express = require("express");

const adminData = require("./admin");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);
router.get("/products/:productId", shopController.getProductDetails);
router.post("/add-to-cart", shopController.addToCart);
module.exports = router;
