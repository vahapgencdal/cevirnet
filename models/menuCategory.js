var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var menuCategorySchema = new Schema({  
    name : String,
    status: Number,    
    cDate : { type: Date, default: Date.now },
    orderNumber:Number,
    categoryId: []
});
mongoose.model('menuCategory', menuCategorySchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}