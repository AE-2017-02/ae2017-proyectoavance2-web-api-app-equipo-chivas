var mongoose = require('mongoose');

var comidaSchema = {
        nombre: { type: String, required:true },
        ingred: [{ idIngred: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Ingrediente" },
                   cant: { type: Number, required:true }           
        }]           
};

module.exports = new mongoose.Schema(comidaSchema);
module.exports.comidaSchema = comidaSchema;
