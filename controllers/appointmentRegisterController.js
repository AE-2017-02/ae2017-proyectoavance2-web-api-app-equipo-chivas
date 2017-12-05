var status = require('http-status');
var handle = require('./../utils/handle');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var _ = require('underscore');
var moment = require('moment');

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

module.exports.getFatMass = function (req, res, RegistroCita, Paciente, HistorialCitas){
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
	
	HistorialCitas.findOne({'idRegistroCitas': _id}, {'paciente': true}, function(error, result){
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}	
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}

		var idPaciente = result.paciente;

		Paciente.findOne({'_id': idPaciente}, {'sexo': true, 'fecha_nacimiento':true}, function(error, resulta){
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}	
		if(!resulta){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}
		
		
		var s = resulta.sexo;
		var fechaActual = moment(new Date());
		var fechaNac = resulta.fecha_nacimiento;
		var valores = fechaNac.split('/');
		switch (valores[1]){
			case "Enero":
				valores[1]='01';
			break;
			case "Febrero":
				valores[1]='02';
			break;
			case "Marzo":
				valores[1]='03';
			break;
			case "Abril":
				valores[1]='04';
			break;
			case "Mayo":
				valores[1]='05';
			break;
			case "Junio":
				valores[1]='06';
			break;
			case "Julio":
				valores[1]='07';
			break;
			case "Agosto":
				valores[1]='08';
			break;
			case "Septiembre":
				valores[1]='09';
			break;
			case "Octubre":
				valores[1]='10';
			break;
			case "Noviembre":
				valores[1]='11';
			break;
			case "Diciembre":
				valores[1]='12';
			break;
			
		}
		fechaNac = valores[2]+'-'+valores[1]+'-'+valores[0];
		fechaNac = moment(fechaNac); 

		
		var edad = fechaActual.diff(fechaNac,'years');
		console.log(resulta.fecha_nacimiento);
		console.log(fechaNac);
		console.log(fechaActual);
		console.log("edad:"+edad);

		var verdadero = true;

		switch(verdadero){
			case  (edad >= 0 && edad <= 19):
				if (s=="H"){
					c1 = 1.162;
					c2 = 0.063;
				}
				if (s=="M"){
					c1 = 1.1549;
					c2 = 0.0678;
				}
				break;
			
			case (edad >= 20 && edad <= 29):
				if (s=="H"){
					c1 = 1.1631;
					c2 = 0.0632;
				}
				if (s=="M"){
					c1 = 1.1599;
					c2 = 0.0717; 
				}
				break;
			case (edad >= 30 && edad <= 39):
				if (s=="H"){
					c1 = 1.1422;
					c2 = 0.0544;
				}
				if (s=="M"){
					c1 = 1.1599;
					c2 = 0.0717; 
				}
				break;
			case (edad >= 40 && edad <= 50):
				if (resulta.s=="H"){
					c1 = 1.162;
					c2 = 0.07;
				}
				if (s=="M"){
					c1 = 1.1333;
					c2 = 0.0612; 
				}
				break;
			case (edad >= 50):
				if (resulta.s=="H"){
					c1 = 1.1715;
					c2 = 0.0779;
				}
				if (s=="M"){
					c1 = 1.1339;
					c2 = 0.0645; 
				}
				break;			
		}
		console.log("c1: "+c1+" c2: "+c2);
		RegistroCita.findOne({'_id': _id}, function(error, resulta2){
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}	
		if(!resulta2){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}
	    var resulta3 = resulta2.toObject();
		var pliegues = resulta2.mediciones.pliegues;
		console.log(resulta3.mediciones.circunferencias);
		console.log(resulta3.mediciones.cirfunferencias);
		if (resulta3.mediciones.circunferencias != undefined){
		var circunferencias = resulta3.mediciones.circunferencias;
		}else{
		var circunferencias = resulta3.mediciones.cirfunferencias;	
		}

		var suma = pliegues.tricipital + pliegues.sEscapulada + pliegues.bicipital + pliegues.siliaco + pliegues.siliaco + pliegues.sespinale + pliegues.abdominal + pliegues.muslo + pliegues.pantorrilla;
  
		var f1 = (c1-(c2*(Math.log(suma))));
		console.log('f1:'+f1);
		var f2 = (((4.95/f1)-4.5)*100);
		console.log('f2:'+f2);
		var f3 = ((f2*resulta2.peso)/1000);
		console.log('f3:'+f3);
		var MMT;
		var AMBdH;
		var AMBdM;
		console.log("brazo:"+circunferencias.brazo);
		AMBdH = ((circunferencias.brazo-(Math.PI*(pliegues.sEscapulada/10)))*((circunferencias.brazo-(Math.PI*(pliegues.sEscapulada/10)))/4*Math.PI)-10);
		AMBdM = ((circunferencias.brazo-(Math.PI*(pliegues.sEscapulada/10)))*((circunferencias.brazo-(Math.PI*(pliegues.sEscapulada/10)))/4*Math.PI)-6.5);		
		console.log('AMBdH:'+AMBdH);
		console.log('AMBdM:'+AMBdM);
		if(s=="H"){
			MMT=(resulta2.talla*(0.0264+(0.0029*AMBdH)));
		}
		if(s=="M"){
			MMT=(resulta2.talla*(0.0264+(0.0029*AMBdM)));
		}
		console.log('MMT:'+MMT);
		var masaOsea = ((resulta2.peso-f3)-MMT);
		console.log('Masa Osea:'+masaOsea);
				
		var valores = {
			"MasaGrasa" : f3,
			"MasaOsea" : masaOsea,
			"MMT": MMT
		}

		res.status(status.OK).json({resultado : valores});
		
	});
});
});

}	


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

module.exports.getFirstAndLastAppointmentRegisterByPatient = function(req, res, RegistroCita, HistorialCitas, Cita){
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
		return res.status(status.BAD_REQUEST).json({error:"No patient id provided"});
	}
	
	HistorialCitas.findOne({'paciente': _id}, function(error, result){
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
		}
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}
		
		if(result.idRegistroCitas.length == 0){
			return res.status(status.NOT_FOUND).json({error: 'El paciente no tiene citas suficientes para la consulta'});
		}
		
		RegistroCita.find({'_id': {$in: result.idRegistroCitas}}).exec(function (err, resulta){
			if(err){
				return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
			}
			if(!resulta){
				return res.status(status.NOT_FOUND).json({error: 'Not found'});
			}
			var obj = [];
			
			var continua = function(){
				
				Cita.find({'_id': {$in:obj}}).sort({'fecha':-1}).limit(1).exec(function(error, resultad){
					if(error){
						return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
					}
					if(!resultad){
						return res.status(status.NOT_FOUND).json({error: 'Not found'});
					}
					Cita.find({'_id':{$in: obj}}).sort({'fecha':1}).limit(1).exec(function(error, resultado){
					if(error){
							return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
						}
						if(!resultado){
							return res.status(status.NOT_FOUND).json({error: 'Not found'});
						}
						
						RegistroCita.find({'idCita':{$in:[resultad[0]._id, resultado[0]._id]}}).populate('idCita').exec(handle.handleOne.bind(null, 'registrodecita', res));
					});
				});
			};
			
			resulta.forEach(function(element, index, arr){	
				obj.push(element.idCita);
				
				if(index == arr.length-1){
					continua();
				}
			});	
		});
	});
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

	RegistroCita.remove({'id':_id}, handle.handleOne.bind(null, 'appointmentRegister', res));
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
			if(registroCita.talla != undefined && appointmentRegister[0].talla != registroCita.talla){
				actualizaCampo('talla', registroCita.talla, funcion1);
			}else{
				funcion1();
			}
		}


		var funcion3 = function(){
			if(registroCita.mediciones != undefined){
				if(registroCita.mediciones.circunferencias != undefined){
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
				actualizaCampo('mediciones.circunferencias.pantorrilla', registroCita.mediciones.circunferencias.pantorrilla, funcion18);
			}else{
				funcion18();
			}			
		}
		
		var funcion18 = function(){
			if(registroCita.mediciones.circunferencias.muneca != undefined && appointmentRegister[0].mediciones.circunferencias.muneca != registroCita.mediciones.circunferencias.muneca){
				actualizaCampo('mediciones.circunferencias.muneca', registroCita.mediciones.circunferencias.muneca, funcion4);
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
			if(registroCita.mediciones.pliegues.bicipital != undefined && appointmentRegister[0].mediciones.pliegues.bicipital != registroCita.mediciones.pliegues.bicipital){
				actualizaCampo('mediciones.pliegues.bicipital', registroCita.mediciones.pliegues.bicipital, funcion12);
			}else{
				funcion12();
			}
		}
		
		var funcion12 = function(){
			if(registroCita.mediciones.pliegues.siliaco != undefined && appointmentRegister[0].mediciones.pliegues.siliaco != registroCita.mediciones.pliegues.siliaco){
				actualizaCampo('mediciones.pliegues.siliaco', registroCita.mediciones.pliegues.siliaco, funcion13);
			}else{
				funcion13();
			}			
		}
		
		var funcion13 = function(){
			if(registroCita.mediciones.pliegues.sespinale != undefined && appointmentRegister[0].mediciones.pliegues.sespinale != registroCita.mediciones.pliegues.sespinale){
				actualizaCampo('mediciones.pliegues.sespinale', registroCita.mediciones.pliegues.sespinale, funcion14);
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