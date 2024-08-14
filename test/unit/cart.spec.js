const Cart = require("../../models/cart");
const assert = require("assert");

const editJsonFile = require("edit-json-file");
var storeRules = editJsonFile("./data/rules.json");
let rules = storeRules.get();

let cart;

describe("Shopping cart", function () {
    describe("shopping cart model", () => {
        function price(emojis) {
            cart = new Cart({}, rules);
            let emojisArray = emojis.split("");
            for (let i = 0; i < emojisArray.length; i++) {
                cart.scan(emojisArray[i]);
            }
            return cart.totalPrice;
        }
        beforeEach(() => {
            cart = new Cart({}, rules);
        });
        it("scan an emoji to the cart", function () {
            cart.scan("A");
            assert.equal(cart.totalPrice, 50);
        });

        it("scan an emoji that doesnt exist on the product list", function () {
            assert.throws(
                function () {
                    cart.scan("R");
                },
                Error,
                "Error thrown"
            );
        });

        it("incremental scan of emojis to the cart", function () {
            assert.equal(cart.totalPrice, 0);
            cart.scan("A");
            assert.equal(cart.totalPrice, 50);
            cart.scan("B");
            assert.equal(cart.totalPrice, 80);
            cart.scan("A");
            assert.equal(cart.totalPrice, 130);
            cart.scan("A");
            assert.equal(cart.totalPrice, 160);
            cart.scan("B");
            assert.equal(cart.totalPrice, 175);
        });

        it("test totals of diferent cars", function () {
            assert.equal(price(""), 0);
            assert.equal(price("A"), 50);
            assert.equal(price("AB"), 80);
            assert.equal(price("CDBA"), 115);

            assert.equal(price("AA"), 100);
            assert.equal(price("AAA"), 130);
            assert.equal(price("AAAA"), 180);
            assert.equal(price("AAAAA"), 230);
            assert.equal(price("AAAAAA"), 260);

            assert.equal(price("AAAB"), 160);
            assert.equal(price("AAABB"), 175);
            assert.equal(price("AAABBD"), 190);
            assert.equal(price("DABABA"), 190);
        });

        it("removes an emoji from the cart", function () {
            var productId = "A";
            cart.scan(productId);
            cart.reduceByOne(productId);
            assert.deepEqual(cart.items, {});
            assert.equal(cart.totalPrice, 0);
        });

        it("remove all quantities of emoji from the cart", function () {
            var productId = "A";
            cart.scan(productId);
            cart.scan(productId);
            cart.removeItem(productId);
            assert.deepEqual(cart.items, {});
            assert.equal(cart.totalPrice, 0);
        });

        it("returns an empty array", function () {
            assert.deepEqual(cart.generateArray(), []);
        });
    });
});
