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
	tabaco: {type: Boolean, required: false},
	talla: {type: Number, required: false},
	presion_arterial: {type:String, required:false},
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
		aceptNotification : {type: Boolean, required: true, default: true},
		timeBefore: {type: Number, required: true, default: 15}
	},
	device_key:{type:String,required:true},
	despensa: [{
		fecha: {type: String, required:true},
		comidaTiempo: {type: String, required:true},
		ingredientes: [{type: String}],
		menuId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Menu"}
	}]
};

module.exports = new mongoose.Schema(pacienteSchema);
module.exports.pacienteSchema = pacienteSchema;