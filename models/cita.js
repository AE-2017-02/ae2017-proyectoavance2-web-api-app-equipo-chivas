var mongoose = require('mongoose');

var citaSchema = {
        fecha:{type:Date, required:true}   
};

module.exports = new mongoose.Schema(citaSchema);
module.exports.citaSchema = citaSchema;