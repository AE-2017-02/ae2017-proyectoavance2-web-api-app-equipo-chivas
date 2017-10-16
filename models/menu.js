var mongoose = require('mongoose');

var menuSchema = {
        nombre: { type: String, required:true },
        comidas: [{ type: Schema.Types.ObjectId, required:true }],
        tipo: { type: String, required:true }       
        
};

module.exports = new mongoose.Schema(menuSchema);
module.exports.menuSchema = menuSchema;