var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');

module.exports.getUsers = function (req, res, Usuario){
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
	Usuario.find({}).exec(handle.handleMany.bind(null, 'usuarios', res));
		
};

module.exports.getUser = function (req, res, Usuario){
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
		return res.status(status.BAD_REQUEST).json({error: "No user id provided"});
	}
	Usuario.find({'_id': _id}).exec(handle.handleOne.bind(null, 'usuario', res));
		
};

module.exports.getUserByLogin = function(req, res, Usuario){
	var expires = moment().add('days', 7).valueOf();
	var app = express();

	app.set('jwtTokenSecret', 'GarnicaUltraSecretKey');
	try{
		var username = req.body.username;
		var password = req.body.password;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Usuario.find({'username': username, 'password':password},function(err,resulta){
		
		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}
		if(!resulta){
			return res.status(status.NOT_FOUND).json({error : 'Login failed, wrong credentials'});
		}
		
		var token = jwt.encode({
			iss: resulta[0]._id,
			exp: expires
		}, app.get('jwtTokenSecret'));
		
		return res.status(status.OK).json({
			token : token,
			expires: expires,
			user: resulta[0].toJSON()
		});
	});
		
}

module.exports.newUser = function (req, res, Usuario){
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
		var usuario = req.body.usuario;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No user provided"});
	}
	Usuario.create(usuario, handle.handleMany.bind(null, 'usuario', res));
		
};

module.exports.deleteUser = function (req, res, Usuario){
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
	Usuario.remove({'_id': _id}, handle.handleOne.bind(null, 'usuario', res));
		
};

module.exports.updateUser = function(req, res, Usuario){
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
		var idUsuario = req.params._id;
		var usuario = req.body.usuario;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Usuario.update({_id: idUsuario}, query, function(err, resu){
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

	Usuario.find({_id: idUsuario}, function(err, user){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!user){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(user) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(usuario.username != undefined && user[0].username != usuario.username){
				actualizaCampo('username', usuario.username, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(usuario.password != undefined && user[0].password != usuario.password){
				actualizaCampo('password', usuario.password, funcion1);
			}else{
				funcion1();
			}
		}
		
		var funcion3 = function(){
			if(usuario.photo != undefined && user[0].photo != usuario.photo){
				actualizaCampo('photo', usuario.photo, funcion2);
			}else{
				funcion2();
			}
		}
		
		var funcion4 = function(){
			if(usuario.name != undefined && user[0].name != usuario.name){
				actualizaCampo('name', usuario.name, funcion3);
			}else{
				funcion3();
			}
		}

		funcion4();
	});
}
	
