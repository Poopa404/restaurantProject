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
require('dotenv').config();

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
    //mongoUrl: "mongodb://127.0.0.1:27017/sweedDb"}),
    mongoUrl: process.env.MONGO_URI}),
    
  })
);
//mongoSweed
//D7t2Jzzg5LDEGFzr
//dckr_pat_oJesakvtE8-T9f7PathdJYrqDvQ
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
const Order = model.Order;
const defaultProduct = require('./model/default');

var productsInCart = [];

app.get("/", async (req, res) => {
  var loginUser = {};
  if(req.session.userId != undefined){
    const currentUser = await Customer.findOne({_id: req.session.userId})
    if(currentUser){
      console.log("login: "+req.session.userId);
      console.log(currentUser.username)
      loginUser = currentUser.username;
    }
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
    if(currentUser){
      loginUser = currentUser.username;
    }
  }

  res.render("menu", {homePage: false, loginUser: loginUser, menu: menu});
})

app.get("/addItem", async (req, res) => {
  const allStoner = await Product.find({ category: "stoner" });
  const allFree = await Product.find({ category: "free" });
  const allDrink = await Product.find({ category: "drink" });
  res.render("addItem", {
    allStoner: allStoner,
    allFree: allFree,
    allDrink: allDrink,
  });
})

app.post("/addItem", async (req, res) => {
  const newId = (await Product.find()).length+1;
  const newProduct = new Product({
    productId: newId,
    name: req.body.productName,
    category: req.body.option,
    price: req.body.productPrice,
  })
  newProduct.save();
  console.log(newProduct)
  res.redirect("/addItem")
})

app.get("/status", async (req, res) => {
  const orderList = await Order.find();
  res.render("statusCheck",{
    orderList: orderList,
  })
})

app.get("/login", (req, res) => {
  res.render("login", {
    email: "",
    warning: ""
  });
})

app.post("/login", async (req, res) => {
  var { email, password } = req.body;
  if(email == "admin@admin" && password == "password"){
    res.redirect("/addItem");
  } else {
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
  if(marketing_accept == "on"){
    marketing_accept = true;
  } else {
    marketing_accept = false;
  }
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
      const newId = Math.floor(Math.floor(Math.random() * 100)*Math.random()*Date.now()/100)
      const newRegister = new Customer({
        customerId: newId,
        username: {
          firstName: first_name,
          lastName: last_name
        },
        password: password,
        location: "",
        email: email,
        marketingAccept: marketing_accept,
        currentCart: [],
        orderCount: 0,
      })
      newRegister.save();

      req.session.userId = newRegister.id;
      res.redirect("/")
    }
  }
})

app.get("/cart", Authen.authentication, async (req, res) => {
  var loginUser = {};
  var listing = {};
  const currentUser = await Customer.findOne({_id: req.session.userId})
  loginUser = currentUser.username;
  listing = await productListing(currentUser);
  res.render("shoppingCart", {
    homePage: false,
    loginUser: loginUser,
    cart: listing.proList,
    subtotal: listing.subtotal,
    vat: listing.vat,
    total: listing.total,
  });
})

app.post("/addToCart", Authen.authentication, async (req, res) => {
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
  
})

app.post("/changeCart", Authen.authentication, async (req, res) => {
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

app.post("/addOrder", Authen.authentication, async (req, res) => {
  const currentUser = await Customer.findOne({_id: req.session.userId})
  loginUser = currentUser.username;
  var calList = await productListing(currentUser);
  var newId = currentUser.orderCount+1
  var newOrder = new Order({
    orderId: newId,
    status: "Cooking",
    customer: currentUser,
    product: calList.proList,
    subtotal: calList.subtotal,
    vat: calList.vat,
    afterVat: calList.afterVat,
    total: calList.total,
    date: new Date().toJSON()
  })
  newOrder.save();
  await Customer.updateOne({ _id: req.session.userId }, { $set: {currentCart: []} })
  await Customer.updateOne({ _id: req.session.userId }, { $inc: {orderCount: 1} })
  res.redirect("/track"+newId)
  
})

app.get("/track:orderId", Authen.authentication, async (req, res) => {
  const orderToFind = req.params.orderId;
  const currentUser = await Customer.findOne({ _id: req.session.userId })
  const order = await Order.findOne({ "customer.customerId": currentUser.customerId, orderId: orderToFind })
  loginUser = currentUser.username;
  if(order){
    res.render("trackOrder",{
      homePage: false,
      loginUser: loginUser,
      order: order,
    });
  } else {
    res.redirect("/")
  }
})

app.get("/profile", Authen.authentication, async (req, res) =>{
  const currentUser = await Customer.findOne({_id: req.session.userId})
  const allOrder = await Order.find({ "customer.customerId": currentUser.customerId })
  loginUser = currentUser.username;
  res.render("profile",{
    homePage: false,
    loginUser: loginUser,
    order: allOrder,
  });
})

app.post("/addLocation", Authen.authentication, async (req, res) => {
  res.redirect("/profile")
})

app.all("/*", (req, res) => {
  res.redirect("/")
})

async function productListing(currentUser){
  var subtotal = 0;
  var vat = 7;
  var total = 0;
  var proList = [];
  var idList = [];
  if(!(currentUser && Object.keys(currentUser).length == 0)){
    var currList = currentUser.currentCart;
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
  }
  // console.log({ proList: proList, subtotal: subtotal, vat: vat, total: total })
  return { proList: proList, subtotal: subtotal, vat: vat, afterVat: subtotal*vat/100 , total: total }
}

