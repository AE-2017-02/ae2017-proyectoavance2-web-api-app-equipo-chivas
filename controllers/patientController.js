var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getPatients = function (req, res, Paciente){
	Paciente.find({}).exec(handle.handleMany.bind(null, 'pacientes', res));
};

module.exports.getPatient = function (req, res, Paciente){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No patient id provided"});
	}
	Paciente.find({'_id': _id}).exec(handle.handleOne.bind(null, 'paciente', res));
};

module.exports.newPatient = function (req, res, Paciente){
	try{
		var paciente = req.body.paciente;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No patient provided"});
	}
	Paciente.create(paciente, handle.handleMany.bind(null, 'paciente', res));
};

module.exports.deletePatient = function (req, res, Paciente){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Paciente.remove({'_id': _id}, handle.handleOne.bind(null, 'paciente', res));
};
