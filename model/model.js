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
    username: {
        type: {
            firstName: String,
            lastName: String,
        },
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: String,
    email: {
        type: String,
        required: true,
    },
    marketingAccept: Boolean,
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
    orderCount: Number,
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
            product: productSchema,
            quantity: {
                type: Number,
                min: 0,
                max: 99
            },
        }],
        required: true,
    },
    subtotal: Number,
    vat: Number,
    afterVat: Number,
    total: Number,
    date: String
})

exports.Order = mongoose.model("Order", orderSchema);