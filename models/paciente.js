<<<<<<< HEAD
var mongoose = require('mongoose');

var pacienteSchema = {
    nombre: { type: String, required: true },
    foto: { type: String, required:true },
    fecha_nacimiento: { type: String, required:true },
    email: {type: String, required: true},
	pin: {type: Number, required: true},
	activo: { type: Boolean, required: true},
	idCita: {type: Schema.Types.ObjectId, required: true},
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
||||||| merged common ancestors
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
=======
var mongoose = require('mongoose');

var pacienteSchema = {
    nombre: { type: String, required: true },
    foto: { type: String, required:false },
    fecha_nacimiento: { type: String, required:false },
    email: {type: String, required: true},
	pin: {type: Number, required: false},
	activo: { type: Boolean, required: true},
	idCita: {type: mongoose.Schema.Types.ObjectId, required:false},
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
	}
};

module.exports = new mongoose.Schema(pacienteSchema);
module.exports.pacienteSchema = pacienteSchema;
>>>>>>> cd513681c69a6c756d5a96d5c1d071273066859f
