var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contactPageSchema = new Schema({  
    title: String,
    content : String,
    icon : String,
    cDate : { type: Date, default: Date.now }
});
mongoose.model('contactpage', contactPageSchema);
module.exports.Schema = function (modelName){
    return{model:mongoose.model(modelName)};
}