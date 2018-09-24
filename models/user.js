var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    cDate: {type: Date, default: Date.now},
    roles: {
        role: String,
        perms: [
            {
                perm: String
            }
        ]
    }
});

mongoose.model('user', userSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
};