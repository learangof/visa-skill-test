const editJsonFile = require("edit-json-file");
var storeData = editJsonFile("./data/products.json");
var products = storeData.get();
module.exports = function Cart(oldCart, rules) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.rules = rules;

    this.scan = function (id) {
        if (products[id] == undefined) {
            throw new Error("id is undefined when Scanning a product");
        }

        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: products[id], qty: 0, price: 0, rule: "" };
        }
        storedItem.qty++;
        this.totalQty++;

        var newPrice = processRule(rules[id], storedItem.item.price, storedItem.qty);

        this.totalPrice -= storedItem.price;
        storedItem.price = newPrice;
        this.totalPrice += newPrice;
    };

    this.reduceByOne = function (id) {
        if (this.items[id] == undefined) {
            throw new Error("id is undefined when removing a product");
        }

        this.items[id].qty--;
        this.totalQty--;

        var newPrice = processRule(rules[id], this.items[id].item.price, this.items[id].qty);

        this.totalPrice -= this.items[id].price;
        this.items[id].price = newPrice;
        this.totalPrice += newPrice;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function (id) {
        if (this.items[id] == undefined) {
            throw new Error("id is undefined when removing a product");
        }
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};
function processRule(rules, price, qty) {
    if (rules == undefined) {
        return price * qty;
    } else {
        let total = 0;

        switch (rules.unit) {
            case "$":
                total = Math.trunc(qty / rules.min) * rules.equal + (qty - Math.trunc(qty / rules.min) * rules.min) * price;
                break;
            default:
                throw new Error("unit rule doesn't exist");
                break;
        }
        return total;
    }
}
