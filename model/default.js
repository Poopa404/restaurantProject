const model = require("./model");
const Product = model.Product;
const p1 = new Product({
  productId: 1,
  name: "p1",
  category: "stoner",
  price: 100,
  new: false,
});
const p2 = new Product({
  productId: 2,
  name: "p2",
  category: "free",
  price: 150,
  new: true,
});
const p3 = new Product({
  productId: 3,
  name: "p3",
  category: "drink",
  price: 50,
  new: false,
});
const p4 = new Product({
    productId: 4,
    name: "p4",
    category: "stoner",
    price: 100,
    new: false,
  });
  const p5 = new Product({
    productId: 5,
    name: "p5",
    category: "free",
    price: 150,
    new: true,
  });
  const p6 = new Product({
    productId: 6,
    name: "p6",
    category: "drink",
    price: 50,
    new: false,
  });
  const p7 = new Product({
    productId: 7,
    name: "p7",
    category: "stoner",
    price: 100,
    new: false,
  });
  const p8 = new Product({
    productId: 8,
    name: "p8",
    category: "free",
    price: 150,
    new: true,
  });
  const p9 = new Product({
    productId: 9,
    name: "p9",
    category: "drink",
    price: 50,
    new: false,
  });
    
exports.defaultProduct = [p1,p2,p3,p4,p5,p6,p7,p8,p9];