const path = require('path')
const bodyParser = require("body-parser");
const express = require('express');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

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

app.get("/", (req, res) => {
  res.render("homePage");
})

app.get("/menu", (req, res) => {
  res.render("menu", {menu: menu});
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/cart", (req, res) => {
  res.render("shoppingCart");
})

app.all("/*", (req, res) => {
  res.redirect("/")
})