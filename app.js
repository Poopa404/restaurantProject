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

app.get("/", (req, res) => {
  res.render("homePage");
})