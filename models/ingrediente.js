// import { ObjectId } from '../../../.cache/typescript/2.6/node_modules/@types/bson';

var mongoose = require('mongoose');

var ingredienteSchema = {
        nombre: { type: String, required:true },
		calorias: {type: Number, required: true},
		unitMeasure: {type: String, required: true},
		grupoAlimento:{ 
			_id: {type: mongoose.Schema.Types.ObjectId, required:true , ref: "GrupoAlimento"},
			nombre: { type: String, required:true },
			energia: { type: Number },
			proteina: { type: Number},
			lipidos: { type: Number },
			carbohidratos: {type:Number}
		}
};

module.exports = new mongoose.Schema(ingredienteSchema);
module.exports.ingredienteSchema = ingredienteSchema;