const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    // mongoose.connect('mongodb://127.0.0.1:27017/sweedDb')
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database is connected'))
    .catch((e) => console.log(e))
}