var config = require("./config");
var mongoose = require('mongoose');
var admin = mongoose.mongo.admin;
mongoose.Promise = global.Promise;
exports.connect = function(callback) {
    mongoose.connect(config.db,{useMongoClient : true});
};

exports.mongoObj = function(){
    return 	mongoose;
};

/// create a connection to the DB
exports.CreateConnection=function(callback,returnFunc){
    var connection = mongoose.createConnection(config.db);

    connection.on('openUri', function() {
        callback(connection,admin,returnFunc);
    });
};

