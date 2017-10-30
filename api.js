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
	
	// region Paciente
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
	//endregion Paciente

	//region Comida
	api.get('/food/', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').getFoods(req, res, Comida);
		};
	}));

	api.get('/food/:_id', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').getFood(req, res, Comida);
		};
	}));

	api.post('/food/', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').newFood(req, res, Comida);
		};
	}));

	api.delete('/food/:_id', wagner.invoke(function (Comida){
		return function(req, res){
			return require('./controllers/foodController').deleteFood(req, res, Comida);
		};
	}));
	
	//endregion Comida
	
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
	// Ingrediente
	api.get('/ingredient/', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').getIngredients(req, res, Ingrediente);
		};
	}));

	api.get('/ingredient/:_id', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').getIngredient(req, res, Ingrediente);
		};
	}));

	api.post('/ingredient/', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').newIngredient(req, res, Ingrediente);
		};
	}));

	api.delete('/ingredient/:_id', wagner.invoke(function (Ingrediente){
		return function(req, res){
			return require('./controllers/ingredientsController').deleteIngredient(req, res, Ingrediente);
		};
	}));
	// end Ingrediente
	return api;
};
