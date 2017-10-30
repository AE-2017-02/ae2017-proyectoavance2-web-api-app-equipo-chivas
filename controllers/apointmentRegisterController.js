var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getAppointmentRegisters = function(req, res, RegistroCita){
	RegistroCita.find({}).exec(handle.handleMany.bind(null, 'registrosdecitas'));
};

module.exports.getAppointmentRegister = function(req, res, RegistroCita){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error:"No AppointmentRegister id provided"});
	}
	RegistroCita.find({'_id':_id}).exec(handle.handleOne.bind(null, 'registrodecita', res));
};

module.exports.newAppointmentRegister = function(req, res, RegistroCita){
	try{
		var registroCita = req.body.registro_cita;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ApointmentRegister provided"});
	}

	RegistroCita.create(registroCita, handle.handleMany.bind(null, 'appointmentRegister', res));
};

module.exports.deleteAppointmentRegister = function(req, res, RegistroCita){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}

	RegistrCita.remove({'id':_id}, handle.handleOne.bind(null, 'appointmentRegister', res));
};
