var mongoose = require('mongoose');

var menuSchema = {
        nombre: { type: String, required:true },
        comidas: [{ type: mongoose.Schema.Types.ObjectId, required:true, ref:"Comida" }],
        tipo: { type: String, required:true }       
        
};

module.exports = new mongoose.Schema(menuSchema);
module.exports.menuSchema = menuSchema;
