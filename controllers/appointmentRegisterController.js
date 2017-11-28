var status = require('http-status');
var handle = require('./../utils/handle');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var _ = require('underscore');

module.exports.getAppointmentRegisters = function(req, res, RegistroCita){
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
	
	RegistroCita.find({}).exec(handle.handleMany.bind(null, 'registrosdecitas', res));
};

module.exports.getAppointmentRegister = function(req, res, RegistroCita){
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
		return res.status(status.BAD_REQUEST).json({error:"No AppointmentRegister id provided"});
	}
	RegistroCita.find({'_id':_id}).exec(handle.handleOne.bind(null, 'registrodecita', res));
};

module.exports.getAppointmentRegisterByAppointment = function(req, res, RegistroCita){
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
		return res.status(status.BAD_REQUEST).json({error:"No AppointmentRegister id provided"});
	}
	RegistroCita.find({'idCita':_id}).exec(handle.handleOne.bind(null, 'registrodecita', res));
};

module.exports.newAppointmentRegister = function(req, res, RegistroCita){
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
		var registroCita = req.body.registro_cita;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ApointmentRegister provided"});
	}

	RegistroCita.create(registroCita, handle.handleMany.bind(null, 'appointmentRegister', res));
};

module.exports.deleteAppointmentRegister = function(req, res, RegistroCita){
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

	RegistrCita.remove({'id':_id}, handle.handleOne.bind(null, 'appointmentRegister', res));
};

module.exports.updateAppointmentRegister = function(req, res, RegistroCita){
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
		var idRegistroCita = req.params._id;
		var registroCita = req.body.registro_cita;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		RegistroCita.update({_id: idRegistroCita}, query, function(err, resu){
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

	RegistroCita.find({_id: idRegistroCita}, function(err, appointmentRegister){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!appointmentRegister){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(registroCita) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}
		
		var funcion0 = function(){
			if(registroCita.idCita != undefined && appointmentRegister[0].idCita != registroCita.idCita){
				actualizaCampo('idCita', registroCita.idCita, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion1 = function(){
			if(registroCita.peso != undefined && appointmentRegister[0].peso != registroCita.peso){
				actualizaCampo('peso', registroCita.peso, funcion0);
			}else{
				funcion0();
			}
		}

		var funcion2 = function(){
			if(registroCita.tipo != undefined && appointmentRegister[0].tipo != registroCita.tipo){
				actualizaCampo('tipo', registroCita.tipo, funcion1);
			}else{
				funcion1();
			}
		}


		var funcion3 = function(){
			if(registroCita.mediciones != undefined){
				if(registroCita.mediciones.cirfunferencias != undefined){
					if(registroCita.mediciones.circunferencias.brazo != undefined && appointmentRegister[0].mediciones.circunferencias.brazo != registroCita.mediciones.circunferencias.brazo){
						actualizaCampo('mediciones.circunferencias.brazo', registroCita.mediciones.circunferencias.brazo, funcion5);
					}else{
						funcion5();
					}
				}else{
					funcion4();
				}
			}else{
				funcion2();
			}
		}
		
		var funcion5 = function(){
			if(registroCita.mediciones.circunferencias.cintura != undefined && appointmentRegister[0].mediciones.circunferencias.cintura != registroCita.mediciones.circunferencias.cintura){
				actualizaCampo('mediciones.circunferencias.cintura', registroCita.mediciones.circunferencias.cintura, funcion6);
			}else{
				funcion6();
			}
		}
		
		var funcion6 = function(){
			if(registroCita.mediciones.circunferencias.cadera != undefined && appointmentRegister[0].mediciones.circunferencias.cadera != registroCita.mediciones.circunferencias.cadera){
				actualizaCampo('mediciones.circunferencias.cadera', registroCita.mediciones.circunferencias.cadera, funcion7);
			}else{
				funcion7();
			}
		}
		
		var funcion7 = function(){
			if(registroCita.mediciones.circunferencias.brazo_cont != undefined && appointmentRegister[0].mediciones.circunferencias.brazo_cont != registroCita.mediciones.circunferencias.brazo_cont){
				actualizaCampo('mediciones.circunferencias.brazo_cont', registroCita.mediciones.circunferencias.brazo_cont, funcion8);
			}else{
				funcion8();
			}
		}
		
		var funcion8 = function(){
			if(registroCita.mediciones.circunferencias.muslo != undefined && appointmentRegister[0].mediciones.circunferencias.muslo != registroCita.mediciones.circunferencias.muslo){
				actualizaCampo('mediciones.circunferencias.muslo', registroCita.mediciones.circunferencias.muslo, funcion9);
			}else{
				funcion9();
			}
		}
		
		var funcion9 = function(){
			if(registroCita.mediciones.circunferencias.pantorrilla != undefined && appointmentRegister[0].mediciones.circunferencias.pantorrilla != registroCita.mediciones.circunferencias.pantorrilla){
				actualizaCampo('mediciones.circunferencias.pantorrilla', registroCita.mediciones.circunferencias.pantorrilla, funcion4);
			}else{
				funcion4();
			}			
		}
		
		var funcion4 = function(){
			if(registroCita.mediciones.pliegues != undefined){
				if(registroCita.mediciones.pliegues.tricipital != undefined && appointmentRegister[0].mediciones.pliegues.tricipital != registroCita.mediciones.pliegues.tricipital){
					actualizaCampo('mediciones.pliegues.tricipital', registroCita.mediciones.pliegues.tricipital, funcion10);
				}else{
					funcion10();
				}
			}else{
				funcion2();
			}
		}
		
		var funcion10 = function(){
			if(registroCita.mediciones.pliegues.sEscapulada != undefined && appointmentRegister[0].mediciones.pliegues.sEscapulada != registroCita.mediciones.pliegues.sEscapulada){
				actualizaCampo('mediciones.pliegues.sEscapulada', registroCita.mediciones.pliegues.sEscapulada, funcion11);
			}else{
				funcion11();
			}
		}
		
		var funcion11 = function(){
			if(registroCita.mediciones.pliegues.bicapital != undefined && appointmentRegister[0].mediciones.pliegues.bicapital != registroCita.mediciones.pliegues.bicapital){
				actualizaCampo('mediciones.pliegues.bicapital', registroCita.mediciones.pliegues.bicapital, funcion12);
			}else{
				funcion12();
			}
		}
		
		var funcion12 = function(){
			if(registroCita.mediciones.pliegues.seliaco != undefined && appointmentRegister[0].mediciones.pliegues.seliaco != registroCita.mediciones.pliegues.seliaco){
				actualizaCampo('mediciones.pliegues.seliaco', registroCita.mediciones.pliegues.seliaco, funcion13);
			}else{
				funcion13();
			}			
		}
		
		var funcion13 = function(){
			if(registroCita.mediciones.pliegues.sespinaje != undefined && appointmentRegister[0].mediciones.pliegues.sespinaje != registroCita.mediciones.pliegues.sespinaje){
				actualizaCampo('mediciones.pliegues.sespinaje', registroCita.mediciones.pliegues.sespinaje, funcion14);
			}else{
				funcion14();
			}			
		}
		
		var funcion14 = function(){
			if(registroCita.mediciones.pliegues.abdominal != undefined && appointmentRegister[0].mediciones.pliegues.abdominal != registroCita.mediciones.pliegues.abdominal){
				actualizaCampo('mediciones.pliegues.abdominal', registroCita.mediciones.pliegues.abdominal, funcion15);
			}else{
				funcion15();
			}			
		}
		
		var funcion15 = function(){
			if(registroCita.mediciones.pliegues.muslo != undefined && appointmentRegister[0].mediciones.pliegues.muslo != registroCita.mediciones.pliegues.muslo){
				actualizaCampo('mediciones.pliegues.muslo', registroCita.mediciones.pliegues.muslo, funcion16);
			}else{
				funcion16();
			}			
		}

		var funcion16 = function(){
			if(registroCita.mediciones.pliegues.pantorrilla != undefined && appointmentRegister[0].mediciones.pliegues.pantorrilla != registroCita.mediciones.pliegues.pantorrilla){
				actualizaCampo('mediciones.pliegues.pantorrilla', registroCita.mediciones.pliegues.pantorrilla, funcion2);
			}else{
				funcion2();
			}			
		}		

		funcion3();
	});
}