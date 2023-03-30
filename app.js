const path = require('path')
const bodyParser = require("body-parser");
const db = require("./config/db");
const model = require("./model/model");
const express = require('express');
const { async } = require('postcss-js');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
db.connect();

app.listen("3000", () => {
  console.log("Server is running on Port 3000.");
});

var menu = [
  {
    type: "stoner",
    name: "Stoner Food",
    items: ["item1","item2","item3"]
  },
  {
    type: "free",
    name: "Stoned-Free Food",
    items: ["item1","item2","item3"]
  },
  {
    type: "drink",
    name: "Drink & Appetizer",
    items: ["item1","item2","item3"]
  }
];

const Product = model.Product;
const defaultProduct = require('./model/default');

var productsInCart = [];

app.get("/", (req, res) => {
  res.render("homePage");
  // Product.insertMany(defaultProduct.defaultProduct)
    // .then(() => console.log("Add the 3 Welcome message succussfuly"))
    // .catch((err) => console.log(err));
})

app.get("/menu", async (req, res) => {
  const stonerProd = await Product.find({category: "stoner"});
  const freeProd = await Product.find({category: "free"});
  const drinkProd = await Product.find({category: "drink"});
  menu[0].items = stonerProd;
  menu[1].items = freeProd; 
  menu[2].items = drinkProd;
  res.render("menu", {menu: menu});
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/cart", async (req, res) => {
  var productList;
  var orderList = [];
  if(productsInCart.length != 0){
    productList = await Product.find({ productId: { $in: productsInCart } });
    productList.forEach(element => {
      var count = 0;
      for (let i = 0; i < productsInCart.length; i++) {
        if(productsInCart[i] == element.productId){
          count += 1;
        }
      }
      orderList.push({ product: element, quantity: count});
    });
  }
  console.log(orderList);
  res.render("shoppingCart", {cart: orderList});
})

app.post("/addToCart", (req, res) => {
  var productToAdd = req.body.submit;
  productsInCart.push(parseInt(productToAdd));
  console.log(productsInCart);
  // res.redirect("/menu");
  res.sendStatus(200);
})

app.all("/*", (req, res) => {
  res.redirect("/")
})
