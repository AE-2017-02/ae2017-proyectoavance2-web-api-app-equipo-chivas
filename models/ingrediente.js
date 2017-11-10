var mongoose = require('mongoose');

var ingredienteSchema = {
        nombre: { type: String, required:true },
		calorias: {type: Number, required: true},
		unitMeasure: {type: String, required: true}
};

module.exports = new mongoose.Schema(ingredienteSchema);
module.exports.ingredienteSchema = ingredienteSchema;