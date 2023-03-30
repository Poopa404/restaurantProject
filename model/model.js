const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

exports.Product = mongoose.model("Product", productSchema);

const customerSchema = new mongoose.Schema({
    customerId: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: String,
    currentCart: {
        type: [{
            productId: Number,
            quantity: {
                type: Number,
                min: 0,
                max: 99
            },
        }],
        required: true,
    },
})

exports.Customer = mongoose.model("Customer", customerSchema);

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    customer: {
        type: customerSchema,
        required: true,
    },
    product: {
        type: [{
            productId: Number,
            quantity: {
                type: Number,
                min: 0,
                max: 99
            },
        }],
        required: true,
    },
})

exports.Order = mongoose.model("Order", orderSchema);