const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/BSc11DB';
let connection;

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB).then(result => {
    connection = result.connection;
    console.log("Connection Successful!");
}).catch(err => {
    console.log("Connection Failed!", err);
})