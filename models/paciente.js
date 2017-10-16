var mongoose = require('mongoose');

var pacienteSchema = {
    nombre: { type: String, required: true },
    foto: { type: String, required:true },
    fecha_nacimiento: { type: String, required:true },
    email: {type: String, required: true},
	pin: {type: Number, required: true},
	activo: { type: Boolean, required: true},
	idCita: {type: Schema.Types.ObjectId, true},
	menu_asignado: [
		{type: Schema.Types.ObjectId}
	],
	obesidad: { type: Boolean, required: true},
	alcohol: {type: Boolean, required:true},
	diabetes: {type:Boolean, required:true},
	colesterol: { type:Boolean, required: true},
	hipertension: { type:Boolean, required: true},
	hipotension: {type: Boolean, required: true},
	pesohabitual: {type: Number, required: true},
	no_gusta: {type: String, required: true},
	sexo: { type: String, required: true},
	lug_nacimiento: { type: String, required:true },
	domicilio: { type: String, required:true },
    telefono: { type: String, required:true },
	patologia: { type: String, required: true},
	alergia: {type: String, required: true},
	tomando_medicacion: {type: String, required: true},
	tratamiento: {type: String, required: true},
	meta: {type: String, required: true},
	userconfig: {
		aceptNotification : {type: String, required: true},
		timeBefore: {type: String, required: true}
	}
};

module.exports = new mongoose.Schema(pacienteSchema);
module.exports.pacienteSchema = pacienteSchema;