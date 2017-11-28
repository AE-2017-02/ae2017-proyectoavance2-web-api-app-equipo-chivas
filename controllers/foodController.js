var status = require('http-status');
var handle = require('./../utils/handle');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var _ = require('underscore');

module.exports.getFoods = function (req, res, Comida, Ingrediente){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
	
	Comida.find({}, function(err, result){
		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!result){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}
		var ingred2 = {};
		
		result.forEach(function(value, index, arr){
			value.ingred.forEach(function(value2, index2, arr2){
				console.log(value2._id);
				Ingrediente.findOne({'_id': value2._id}, {'nombre':true, 'calorias':true}, function(err, resulta){
					if(!resulta){
						
					}else{
						ingred2 = result[index].ingred[index2].toObject();
						ingred2.nombre = resulta.nombre;
						ingred2.calorias = resulta.calorias;
						result[index].ingred[index2] = ingred2;
					}
					
					if(index == arr.length-1 && index2 == arr2.length-1){
						return res.status(status.OK).json({'comidas': result});
					}
				}); 
			});
		});
	});
};

module.exports.getFood = function (req, res, Comida){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
	
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No food id provided"});
	}
	Comida.find({'_id': _id}).exec(handle.handleOne.bind(null, 'comida', res));
};

module.exports.newFood = function (req, res, Comida, Ingrediente){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
	
	try{
		var comida = req.body.comida;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No food provided"});
	}
	
	var createFood = function(){
		Comida.create(comida, function(err, result){
		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!result){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}
		
		var ingredComplets = [];
		
		result.ingred.forEach(function(value, index, ar){
			Ingrediente.findOne({'_id' : value._id}, function(erro, resulta){
					
			var objTemp = {};
			
			objTemp._id = resulta._id;
			objTemp.nombre = resulta.nombre;
			objTemp.calorias = resulta.calorias;
			objTemp.cant = comida.ingred[index].cant;
			ingredComplets.push(objTemp);
		
			if(index == ar.length-1){
				console.log(ingredComplets);

				var resultados = result.toObject();
				resultados.ingred = ingredComplets;
				
				return res.status(status.OK).json({'comida' : resultados});
			}
		});   
	});
		});
	}
	
	var ingredIds = [];
	
	comida.ingred.forEach(function(value, index, ar) {
		var objTemp = {};
				
		objTemp._id = value._id;
		objTemp.cantidad = value.cant;
		
		ingredIds.push(objTemp);
		
		if(index == ar.length-1){
			comida.ingred = ingredIds;
			createFood();
		}
	});
};

module.exports.deleteFood = function (req, res, Comida){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
	
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Comida.remove({'_id': _id}, handle.handleOne.bind(null, 'comida', res));
};

module.exports.updateFood = function(req, res, Comida){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
	
	try{
		var idComida = req.params._id;
		var comida = req.body.comida;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Comida.update({_id: idComida}, query, function(err, resu){
			if(err){
				return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
			}
			if(!resu){
				return res.status(status.NOT_FOUND).json({error: 'Not found'});
			}
			camposActualizados+=campo+" ";
			count ++;
			funcion();
		});
	};

	Comida.find({_id: idComida}, function(err, food){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!food){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(comida) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(comida.nombre != undefined && food[0].nombre != comida.nombre){
				actualizaCampo('nombre', comida.nombre, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(comida.ingred != undefined && food[0].ingred != comida.ingred){
				actualizaCampo('ingred', comida.ingred, funcion1);
			}else{
				funcion1();
			}
		}

		funcion2();
	});
}