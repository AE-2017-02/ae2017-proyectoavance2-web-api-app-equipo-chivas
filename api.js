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
			return require('./controllers/foodController').getPatients(req, res, Paciente);
		};
	}));

	api.get('/patient/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/foodController').getPatient(req, res, Paciente);
		};
	}));

	api.post('/patient/', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/foodController').newPatient(req, res, Paciente);
		};
	}));

	api.delete('/patient/:_id', wagner.invoke(function (Paciente){
		return function(req, res){
			return require('./controllers/foodController').deletePatient(req, res, Paciente);
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
			return require('./controllers/foodController').deletePatient(req, res, Comida);
		};
	}));
	
	//endregion Comida

	return api;
};
