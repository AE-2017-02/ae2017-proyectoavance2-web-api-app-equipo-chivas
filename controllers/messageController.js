var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');

module.exports.getMessages = function (req, res, Mensaje){
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
	Mensaje.find({}).exec(handle.handleMany.bind(null, 'mensajes', res));
};

module.exports.getMessage = function (req, res, Mensaje){
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
		return res.status(status.BAD_REQUEST).json({error: "No message id provided"});
	}
	Mensaje.find({'_id': _id}).exec(handle.handleOne.bind(null, 'mensaje', res));
};

module.exports.newMessage = function (req, res, Mensaje){
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
		var mensaje = req.body.mensaje;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No message provided"});
	}
	Mensaje.create(mensaje, function(error,result){
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
		}
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}

		var devices = [];

		mensaje.to.forEach(function(element) {
			devices.push(element.deviceToken);
		});
		
		const notify = require('./../utils/onesignal')("MzE2ZDk0MTctMzdhOC00OWRmLWI5NGItZGRiMmM1Zjc3Mjgy", "ee63927a-ed8e-4510-a20e-687d880eb211");
		notify.notifyUser({
			message: mensaje.cuerpo,
			onesignal_id: devices
		  }, (err, response) => {
			res.status(status.OK).json({"mensaje": result});
		});
	});
	
};

module.exports.deleteMessage = function (req, res, Mensaje){
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
	Mensaje.remove({'_id': _id}, handle.handleOne.bind(null, 'mensaje', res));
};

module.exports.updateMessage = function(req, res, Mensaje){
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
		var idMensaje = req.params._id;
		var mensaje = req.body.mensaje;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Mensaje.update({_id: idMensaje}, query, function(err, resu){
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

	Mensaje.find({_id: idMensaje}, function(err, message){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!message){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(mensaje) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(mensaje.titulo != undefined && message[0].titulo != mensaje.titulo){
				actualizaCampo('titulo', mensaje.titulo, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(mensaje.cuerpo != undefined && message[0].cuerpo != mensaje.cuerpo){
				actualizaCampo('cuerpo', mensaje.cuerpo, funcion1);
			}else{
				funcion1();
			}
		}

        var funcion3 = function(){
			if(mensaje.to != undefined && message[0].to != mensaje.to){
				actualizaCampo('to', mensaje.to, funcion2);
			}else{
				funcion2();
			}
		}


		funcion3();
	});
}
