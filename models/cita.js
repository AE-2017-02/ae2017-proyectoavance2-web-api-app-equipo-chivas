var mongoose = require('mongoose');

var citaSchema = {
        fecha:{type:Date, required:true},  
        status:{type:String, required:true} 
};

module.exports = new mongoose.Schema(citaSchema);
module.exports.citaSchema = citaSchema;