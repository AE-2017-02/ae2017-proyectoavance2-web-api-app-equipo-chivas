var mongoose = require('mongoose');

var comidaSchema = {
        nombre: { type: String, required:true },
		tipo: { type:String, required: false},
        ingred: [{ _id: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Ingrediente" },
                   cant: { type: Number, required:true, default: 0 }
        }]           
};

module.exports = new mongoose.Schema(comidaSchema);
module.exports.comidaSchema = comidaSchema;
