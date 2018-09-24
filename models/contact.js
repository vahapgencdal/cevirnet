var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contactSchema = new Schema({  
    email: String,
    userName : String,
    message : String,
    cDate : { type: Date, default: Date.now }
});
mongoose.model('contact', contactSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}