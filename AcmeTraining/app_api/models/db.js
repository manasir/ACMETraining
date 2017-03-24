console.log("db.js starts here");
var mongoose = require('mongoose');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../Acmetraining/app_server/db.properties');

var uri = properties.get('main.uri');
mongoose.connect(uri);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + uri);
});

mongoose.connection.on('error', function () {
    console.log('Mongoose connection error ');
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.on('SIGINT', function () {
    gracefulShutdown("app termination", function () {
        process.exit(0);
    });
});

require('./schoolSchema');