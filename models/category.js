var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({  
    name: String,
    desc : String,
    icon : String,
    cDate : { type: Date, default: Date.now },
    subcategory : [
        {
            name : String,
            desc : String ,
            units : [ 
			  {
                name  : String,
                scode : String,
                value : Number  
		      }
            ]
        }
    ]
});
mongoose.model('category', categorySchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}