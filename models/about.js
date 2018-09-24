var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var aboutSchema = new Schema({  
    title: String,
    content : String,
    icon : String,
    cDate : { type: Date, default: Date.now }
});
mongoose.model('about', aboutSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}