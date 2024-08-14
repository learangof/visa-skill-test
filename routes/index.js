var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");

const editJsonFile = require("edit-json-file");
var storeData = editJsonFile("./data/products.json");

var storeRules = editJsonFile("./data/rules.json");
let rules = storeRules.get();

/* GET home page. */
router.get("/", function (req, res, next) {
    let successMsg = req.session.msg ? req.session.msg : "";
    let errorMsg = "";
    if (req.session.error) {
        successMsg = "";
        errorMsg = req.session.msg;
    }

    req.session.msg = "";
    req.session.error = false;
    let data = storeData.get();

    var products = [];
    for (const key in data) {
        products.push(data[key]);
    }

    res.render("shop/index", {
        title: "Emoji Store",
        products: products,
        successMsg: successMsg,
        errorMsg: errorMsg,
    });
});

router.get("/add-to-cart/:id", function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}, rules);

    try {
        cart.scan(productId);
        req.session.cart = cart;
        req.session.msg = "Item added successfully!";
        res.redirect("/");
    } catch (error) {
        console.log(error);
        req.session.error = true;
        req.session.msg = "Unable to find item";
        return res.redirect("/");
    }
});

router.get("/add/:id", function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}, rules);

    try {
        cart.scan(productId);
        req.session.cart = cart;
        req.session.msg = "Item added successfully!";
        res.redirect("/shopping-cart");
    } catch (error) {
        console.log(error);
        req.session.error = true;
        req.session.msg = "Unable to find item";
        return res.redirect("/");
    }
});

router.get("/reduce/:id", function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}, rules);

    try {
        cart.reduceByOne(productId);
        req.session.cart = cart;
        req.session.msg = "Item removed successfully!";
        res.redirect("/shopping-cart");
    } catch (error) {
        console.log(error);
        req.session.error = true;
        req.session.msg = "Unable to find item";
        return res.redirect("/");
    }
});

router.get("/remove/:id", function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}, rules);

    try {
        cart.removeItem(productId);
        req.session.cart = cart;
        req.session.msg = "Item Batch removed successfully!";
        res.redirect("/shopping-cart");
    } catch (error) {
        console.log(error);
        req.session.error = true;
        req.session.msg = "Unable to find item";
        return res.redirect("/");
    }
});

router.get("/shopping-cart", function (req, res, next) {
    let successMsg = req.session.msg ? req.session.msg : "";
    let errorMsg = "";
    if (req.session.error) {
        successMsg = "";
        errorMsg = req.session.msg;
    }

    req.session.msg = "";
    req.session.error = false;

    if (!req.session.cart) {
        return res.render("shop/shopping-cart", {
            products: null,
        });
    }
    var cart = new Cart(req.session.cart);
    res.render("shop/shopping-cart", {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        successMsg: successMsg,
        errorMsg: errorMsg,
    });
});

module.exports = router;
