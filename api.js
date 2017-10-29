var express = require('express');
var status = require('http-status');
var bodyParser = require('body-parser');
var _ = require('underscore');

// Cuando se hace la petición, la API retorna una función que pone disponibles las url
// para los métodos POST, GET, PUT o DELETE.

module.exports = function(wagner){
	var api = express.Router();
	api.use(bodyParser.json());
	
	//Permite recuperar los parámetros de la ruta.
	
	api.use(bodyParser.urlencoded({
		extended: true
	}));
	
	//RUTAS DE LAS APIS A REQUERIR.
	
	//Paciente
	api.get('/patient/', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPatients(req, res, Paciente);
		};
	}));

	api.get('/patient/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').getPatient(req, res, Paciente);
		};
	}));

	api.post('/patient/', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').newPatient(req, res, Paciente);
		};
	}));

	api.put('/patient/:_id', wagner.invoke(function(Paciente){
		return function(req, res){
			return require('./controllers/patientController').updatePatient(req, res, Paciente);
		};
	}));

	api.delete('/patient/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/patientController').deletePatient(req, res, Paciente);
		};
	}));
	//end Paciente
	
	//RegistroCita
	api.get('/appointmentRegister/', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').getAppointmentRegisters(req, res, RegistroCita);
		};
	}));

	api.get('/appointmentRegister/:_id', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').getAppointmentRegister(req, res, RegistroCita);
		};
	}));

	api.post('/appointmentRegister/', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').newAppointmentRegister(req, res, RegistroCita);
		};
	}));

	api.delete('/appointmentRegister/:_id', wagner.invoke(function (RegistroCita){
		return function(req, res){
			return require('./controllers/apointmentRegisterController').deleteAppointmentRegister(req, res, RegistroCita);
		};
	}));
	//end RegistroCita

	return api;
};
