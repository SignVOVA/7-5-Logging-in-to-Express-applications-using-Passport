var mongoose = require('mongoose');

mongoose.connect('localhost:27017/flights');

module.exports = mongoose.connection;
