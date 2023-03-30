const path = require('path')
const bodyParser = require("body-parser");
const db = require("./config/db");
const model = require("./model/model");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const Authen = require("./control/authen");
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

app.use(
  session({
    secret: "jklfsodifjsktnwjasdp465dd",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, //one hour
    store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/sweedDb"}),
  })
);
  

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
const Customer = model.Customer;
const defaultProduct = require('./model/default');
const { includes } = require('lodash');

var productsInCart = [];

app.get("/", async (req, res) => {
  var loginUser = {};
  if(req.session.userId != undefined){
    const currentUser = await Customer.findOne({_id: req.session.userId})
    console.log("login: "+req.session.userId);
    console.log(currentUser.username)
    loginUser = currentUser.username;
  } else {
    console.log(req.session)
    console.log(loginUser);
  }
  res.render("homePage", {homePage: true, loginUser: loginUser});
})

app.get("/menu", async (req, res) => {
  const stonerProd = await Product.find({category: "stoner"});
  const freeProd = await Product.find({category: "free"});
  const drinkProd = await Product.find({category: "drink"});
  menu[0].items = stonerProd;
  menu[1].items = freeProd; 
  menu[2].items = drinkProd;

  var loginUser = {};
  if(req.session.userId != undefined){
    const currentUser = await Customer.findOne({_id: req.session.userId})
    loginUser = currentUser.username;
  }

  res.render("menu", {homePage: false, loginUser: loginUser, menu: menu});
})

app.get("/login", (req, res) => {
  res.render("login", {
    email: "",
    warning: ""
  });
})

app.post("/login", async (req, res) => {
  var { email, password } = req.body;
  const oldUser = await Customer.findOne({email: email, password: password});
  if(oldUser){
    req.session.userId = oldUser.id;
    res.redirect("/");
  } else {
    res.render("login", {
      email: email,
      warning: "Email or Password incorrect!"
    });
  }
})

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  })
})

app.get("/register", (req, res) => {
  res.render("register", {
    defaultValue: {
      first_name: "",
      last_name: "",
      email: "",
    },
    warning: "",
  });
})

app.post("/register", async (req, res) => {
  var { first_name, last_name, email, password, password_confirmation, marketing_accept } = req.body;
  if(password != password_confirmation){
    res.render("register", {
      defaultValue: {
        first_name: first_name,
        last_name: last_name,
        email: email,
      },
      warning: "Password does not match!",
    });
  } else {
    const oldUser = await Customer.findOne({email: email, password: password});
    if(oldUser){
      res.render("register", {
        defaultValue: {
          first_name: "",
          last_name: "",
          email: "",
        },
        warning: "Account already exist!",
      });
    } else {
      const newRegister = new Customer({
        username: {
          firstName: first_name,
          lastName: last_name
        },
        password: password,
        location: "",
        email: email,
        marketingAccept: marketing_accept,
        currentCart: []
      })
      newRegister.save();

      req.session.userId = newRegister.id;
      res.redirect("/")
    }
  }
})

app.get("/cart", async (req, res) => {
  var subtotal = 0;
  var vat = 7;
  var total = 0;
  var loginUser = {};
  var currList = [];
  var proList = [];
  var idList = [];
  if(req.session.userId != undefined){
    const currentUser = await Customer.findOne({_id: req.session.userId})
    loginUser = currentUser.username;
    currList = currentUser.currentCart;
  }
  currList.forEach((el) => {
    idList.push(el.productId);
  })
  if(idList.length != 0){
    var prodObj = await Product.find({ productId: { $in: idList } });
    currList.forEach((el) => {
      prodObj.forEach((prod) => {
        if(el.productId == prod.productId){
          proList.push({ product: prod, quantity: el.quantity })
          subtotal += prod.price*el.quantity;
        }
      })
    })
  }
  total = Math.ceil(subtotal+(subtotal*vat/100));
  // console.log(subtotal+" "+vat+" "+total)

  res.render("shoppingCart", {
    homePage: false,
    loginUser: loginUser,
    cart: proList,
    subtotal: subtotal,
    vat: vat,
    total: total,
  });
})

app.post("/addToCart", async (req, res) => {
  if(req.session.userId != undefined){
    const currentUser = await Customer.findOne({_id: req.session.userId})
    var productToAdd = req.body.submit;
    var proId = parseInt(productToAdd);
    var currCart = currentUser.currentCart;
    var newPro = true;
    currCart.forEach((element) => {
      if(element.productId == proId){
        element.quantity += 1;
        newPro = false;
      }
    })
    if(newPro){
      currCart.push({productId: proId, quantity: 1})
    }
    await Customer.updateOne({ _id: req.session.userId }, { $set: {currentCart: currCart} })
    // console.log(currCart);
    res.sendStatus(200);
  }
})

app.post("/changeCart", async (req, res) => {
  const currentUser = await Customer.findOne({ _id: req.session.userId } )
  const currCart = currentUser.currentCart;
  var idToChange = req.body.id;
  var quantityToChange = req.body.quantity;
  var toDelete = -1;
  if(quantityToChange != 0){
    currCart.forEach(element => {
      if(element.productId == idToChange){
        element.quantity = quantityToChange
      }
    });
  } else {
    toDelete = currCart.findIndex((obj) => obj.productId == idToChange);
    if(toDelete > -1){
      currCart.splice(toDelete, 1);
    }
  }
  await Customer.updateOne({ _id: req.session.userId }, { $set: {currentCart: currCart} })
  res.redirect("/cart")
})

app.all("/*", (req, res) => {
  res.redirect("/")
})
