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
	
	api.use(bodyParser.urlenconded({
		extended: true
	}));
	
	//RUTAS DE LAS APIS A REQUERIR.
	
	return api;
};