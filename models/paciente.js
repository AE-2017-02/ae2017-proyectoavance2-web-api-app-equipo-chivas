var mongoose = require('mongoose');

var pacienteSchema = {
    nombre: { type: String, required: true },
    foto: { type: String, required:false },
    fecha_nacimiento: { type: String, required:false },
    email: {type: String, required: true},
	pin: {type: Number, required: false},
	activo: { type: Boolean, required: true},
	idCita: {type: mongoose.Schema.Types.ObjectId, required:false, ref:"Cita"},
	menu_asignado: [
		{type: mongoose.Schema.Types.ObjectId, ref: "MenuUsuario"}
	],
	obesidad: { type: Boolean, required: false},
	alcohol: {type: Boolean, required:false},
	diabetes: {type:Boolean, required:false},
	colesterol: { type:Boolean, required: false},
	hipertension: { type:Boolean, required: false},
	hipotension: {type: Boolean, required: false},
	pesohabitual: {type: Number, required: false},
	no_gusta: {type: String, required: false},
	sexo: { type: String, required: true},
	lug_nacimiento: { type: String, required:false },
	domicilio: { type: String, required:false },
    telefono: { type: String, required:false },
	patologia: { type: String, required: false},
	alergia: {type: String, required: false},
	tomando_medicacion: {type: String, required: false},
	tratamiento: {type: String, required: false},
	meta: {type: String, required: false},
	userconfig: {
		aceptNotification : {type: Boolean, required: false},
		timeBefore: {type: Number, required: false}
	},
	device_key:{type:String,require:true}
};

module.exports = new mongoose.Schema(pacienteSchema);
module.exports.pacienteSchema = pacienteSchema;