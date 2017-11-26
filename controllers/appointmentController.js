var status = require('http-status');
var handle = require('./../utils/handle');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var _ = require('underscore');

module.exports.getAppointments = function (req, res, Cita){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
			Cita.find({}).exec(handle.handleMany.bind(null, 'appointments', res));
		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
};

module.exports.getAppointment = function (req, res, Cita){
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
		return res.status(status.BAD_REQUEST).json({error: "No appointment id provided"});
	}
	Cita.find({'_id': _id}).exec(handle.handleOne.bind(null, 'appointment', res));	
};


module.exports.getPendingAppointments = function (req, res, Cita, Paciente){
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
		var date = req.params.date;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No appointment id provided"});
	}
	
	Cita.find({ $and: [
				{'fecha': { $gte : new Date(date+"T00:00:00") }}, 
				{'fecha':{$lte: new Date(date+"T23:59:59")}}, 
				{'status': 'pendiente'}
			]},  {
				sort:{
					fecha: -1 //Sort by Date Added DESC
				}
		}, function(error, result){
		
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
		}
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}
		
		if(result.length == 0){
			res.status(status.OK).json({appointment : result});				
		}
		var i=0;
		
			result.forEach(function(element) {
				
			Paciente.findOne({'idCita': element._id}, {'nombre': true}, function(error, resulta){
				if(error){
					return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
				}
				
				var element2 = element.toObject();
				if(resulta != null){
					
					element2.namePatient = resulta.nombre;
					element2.idPatient = resulta._id;
					
					result[result.indexOf(element)] = element2;
				}else{										
					element2["namePatient"] = "";
					element2["idPatient"] = "";
					result[result.indexOf(element)] = element2;
				}
				if(result.indexOf(element2) == result.length-1){
					return res.status(status.OK).json({appointment : result});	
				}
			});		

			});
		});
};

module.exports.getAppointmentsUsedForDate = function (req, res, Cita){
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
		var date = req.params.date;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No appointment id provided"});
	}
	
	Cita.find({ $and: [{'fecha': { $gte : new Date(date+"T00:00:00") }}, {'fecha':{$lte: new Date(date+"T23:59:59")}}]}, function(error, result){
		
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}
		
		var finalresult = [];

		for(var i =0; i<Object.keys(result).length; i++){
			var count = 0;
			for(var j=0; j<Object.keys(result).length; j++){
				if(result[i].fecha.getTime() === result[j].fecha.getTime()){
					count ++;
				}
			}
			if((count >= 2)){
				finalresult.push(result[i].fecha);
			}
		}
		
		var uniqueArray = finalresult
		.map(function (date) { return date.getTime() })
		.filter(function (date, i, array) {
			return array.indexOf(date) === i;
		})
		.map(function (time) { return new Date(time); });
		
		res.status(status.OK).json({appointment : uniqueArray});
		
	});
};

module.exports.newAppointment = function (req, res, Cita){
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
		var appointment = req.body.cita;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No appointment provided"});
	}
	Cita.create(appointment, handle.handleMany.bind(null, 'appointment', res));
};

module.exports.deleteAppointment = function (req, res, Cita){
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
	Cita.remove({'_id': _id}, handle.handleOne.bind(null, 'appointment', res));
};

module.exports.updateAppointment = function(req, res, Cita){
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
		var idCita = req.params._id;
		var cita = req.body.cita;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Cita.update({_id: idCita}, query, function(err, resu){
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

	Cita.find({_id: idCita}, function(err, appointment){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!appointment){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(cita) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(cita.fecha != undefined && appointment[0].fecha != cita.fecha){
				actualizaCampo('fecha', cita.fecha, funcionfinal);
			}else{
				funcionfinal();
			}
		}
		
		var funcion2 = function(){
			if(cita.status != undefined && appointment[0].status != cita.status){
				actualizaCampo('status', cita.status, funcion1);
			}else{
				funcion1();
			}
		}

		funcion2();
	});
}