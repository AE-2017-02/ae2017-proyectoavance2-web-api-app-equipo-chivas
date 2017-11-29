// import { ObjectId } from '../../../.cache/typescript/2.6/node_modules/@types/bson';

var mongoose = require('mongoose');

var ingredienteSchema = {
        nombre: { type: String, required:true },
		unitMeasure: {type: String, required: true},
		porcion: {type: Number,required:true},		
		grupoAlimento:{ 
			_id: {type: mongoose.Schema.Types.ObjectId, required:true , ref: "GrupoAlimento"}
		},
};

module.exports = new mongoose.Schema(ingredienteSchema);
module.exports.ingredienteSchema = ingredienteSchema;