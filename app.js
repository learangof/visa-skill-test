var express = require("express");
var path = require("path");
var { engine } = require("express-handlebars");
var session = require("express-session");
var editJsonFile = require("edit-json-file");

var dotenv = require("dotenv");

dotenv.config();

var storeData = editJsonFile("./data/products.json");

const app = express();

// view engine setup
app.engine(".hbs", engine({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use(
    session({
        secret: "keycatkey",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 180 * 60 * 1000 },
    })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

var routes = require("./routes/index");
app.use("/", routes);

// app.get('/', (req, res) => {
//     res.render('shop/index');
// });
var port = 3001;
var http = require("http");
app.set("port", port);

var server = http.createServer(app);

app.listen(port, () => {
    console.log("App Started");
});

module.exports = app;
