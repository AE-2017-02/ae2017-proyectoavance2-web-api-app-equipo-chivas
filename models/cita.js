var mongoose = require('mongoose');

var citaSchema = {
        dia:{type:Number, required:true},
        mes :{type:Number, required:true},
        año:{type:Number, required:true},
        hora:{type:Number, required:true},
        min:{type:Number, required:true},
        
};

module.exports = new mongoose.Schema(citaSchema);
module.exports.citaSchema = citaSchema;