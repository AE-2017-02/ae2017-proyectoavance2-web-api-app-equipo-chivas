var status = require('http-status');
var handle = require('./../utils/handle');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var _ = require('underscore');

module.exports.getPatients = function (req, res, Paciente){
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
			
			Paciente.find({},{"despensa": 0}).exec(handle.handleMany.bind(null, 'pacientes', res));

		} catch (err) {
			return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
		}
	} else {
		return res.status(status.FORBIDDEN).json({error: 'No valid access token provided'});
	}
};

module.exports.getPatient = function (req, res, Paciente){
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
		return res.status(status.BAD_REQUEST).json({error: "No patient id provided"});
	}
	Paciente.find({'_id': _id},{"despensa": 0}).exec(handle.handleOne.bind(null, 'paciente', res));
};

module.exports.getActivePatients = function (req, res, Paciente){
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
		return res.status(status.BAD_REQUEST).json({error: "No patient id provided"});
	}
	Paciente.find({'_id': _id, "activo":true},{"despensa": 0}).exec(handle.handleOne.bind(null, 'paciente', res));
};

module.exports.getPatientByLogin = function(req, res, Paciente){
	var expires = moment().add('days', 7).valueOf();
	var app = express();

	app.set('jwtTokenSecret', 'GarnicaUltraSecretKey');
	try{
		var email = req.body.paciente.email;
		var pin = req.body.paciente.pin;
		var deviceKey = req.body.paciente.deviceKey;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}

	Paciente.find({'email': email, 'pin': pin},{"despensa": 0}, function(err, resulta){
		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}
		if(!resulta){
			return res.status(status.NOT_FOUND).json({error : 'Login failed, wrong credentials'});
		}
		Paciente.update({'email': email, 'pin':pin}, {'device_key': deviceKey}, function(error, result){
			
			resulta[0].device_key = deviceKey;
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

	});	
}

module.exports.getPatientsWithValidDate = function(req, res, Paciente, Cita){
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
	Paciente.find({activo: true},{"despensa": 0}, function(err, result){
		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}
		
		var i = 0;
		var numberUsers = 0;
		
		var funcion1 = function(){
			if(i == result.length){
				return res.status(status.OK).json({numUsers: numberUsers});
			}else{
				funcion2(result[i]);				
			}
		}
		
		var funcion2 = function(elemento){
			
			Cita.findOne({"_id": elemento.idCita}, function(err2, resulta){
				if(err2){
					return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
				}
				
				if(resulta != undefined){
					if(resulta.status == "pendiente" && resulta.fecha >= new Date( new Date().getTime() + 7 * 3600 * 1000)){
						numberUsers++;
					}
				}
				i++;
				funcion1();
			});
		}
		
		funcion1();
	});
}

module.exports.getPantryMenusForDate = function(req, res, Paciente){
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
		var fecha = req.params.fecha;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No patient provided"});
	}
	
	var response = [];
	
	Paciente.findOne({"_id": _id}, function(err, result){
		
		var i = 0;
		
		var function1 = function(){
			if(result.despensa.length == i){
				return res.status(status.OK).json({'despensa': response});
			}else{
				function2(result.despensa[i]);	
			}
		}
		
		var function2 = function(value){
			if(value.fecha == fecha){
				response.push(value);
			}
			i++;
			function1();
		}
		
		function1();
	});
	//Paciente.aggregate({$project : {despensa:1, _id:1}}{$unwind: "$despensa"}, {$match:{"despensa.fecha": fecha, "_id": _id}})
}

module.exports.getPantryMenusForDate2 = function(req, res, Paciente){
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
		var fecha = req.params.fecha;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No patient provided"});
	}
	
	var response = [];
	
	Paciente.findOne({"_id": _id}, function(err, result){
		
		var i = 0;
		
		var function1 = function(){
			if(result.despensa.length == i){
				return res.status(status.OK).json({'despensa': response});
			}else{
				function2(result.despensa[i]);	
			}
		}
		
		var function2 = function(value){
			if(value.fecha == fecha){
				for(var k=0; k<value.ingredientes.length; k++){
					if(response.indexOf(value.ingredientes[k]) === -1){
						response.push(value.ingredientes[k]);	
					}else{
						var number = value.ingredientes[k].split(' ')[0];
						var number2 = response[response.indexOf(value.ingredientes[k])].split(' ')[0];
						
						var number3 = parseInt(number)+parseInt(number2);
						
						var newString = response[response.indexOf(value.ingredientes[k])].replace(number2, number3);
						console.log(newString)
						response[response.indexOf(value.ingredientes[k])] = newString;
					}
				}
			}
			i++;
			function1();
		}
		
		function1();
	});
	//Paciente.aggregate({$project : {despensa:1, _id:1}}{$unwind: "$despensa"}, {$match:{"despensa.fecha": fecha, "_id": _id}})
}

module.exports.newPatient = function (req, res, Paciente){
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
		var paciente = req.body.paciente;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No patient provided"});
	}
	
	Paciente.find({'email': paciente.email}, function(err, patient){
		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}
		if(patient[0] != undefined){
			return res.status(status.NOT_FOUND).json({error : 'Cant create, user email is already in use'});
		}else{
			Paciente.create(paciente, handle.handleMany.bind(null, 'paciente', res));
		}
	});
};

module.exports.setPatientPantry = function(req, res, Paciente, Comida){
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
		var idComida = req.body.paciente.idComida;
		var fecha = req.body.paciente.fecha;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Comida.findOne({"_id": idComida})
		.populate({path: "ingred._id", model: "Ingrediente"}).exec(function(error, result){
			
			var i = 0;
			var j = 0;
			
			var funcion1 = function(element){
				Paciente.update({"_id": _id,
					"despensa":{
						"$not":{
							"$elemMatch":{
								"fecha":fecha,
								"comidaTiempo":result.tipo,
								"menuId":idComida
							}
						}
					}
				}, {$addToSet: {"despensa" : {"fecha": fecha, "comidaTiempo": result.tipo, "menuId": idComida, "ingredientes": []}}}).exec(function(err, resulta){
					if(err){
						return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
					}
					
					console.log(resulta)
					Paciente.update({"_id": _id, "despensa": { $elemMatch: {"fecha":fecha, "comidaTiempo": result.tipo, "menuId" : idComida}}}, {$push: {"despensa.$.ingredientes" : ""+element._id.porcion*result.ingred[i].cant+" "+element._id.unitMeasure+" de "+element._id.nombre } }).exec(function(error, resultad){
						if(error){
							return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
						}
							console.log(resultad);
							i++;
							funcion2();
					});
				});	
			}
			
			var funcion2 = function(){
				if(i == result.ingred.length){
					res.status(status.OK).json({"updatedPantry":true});
				}else{
					funcion1(result.ingred[i]);	
				}
			}
			
			funcion2();
		});
}

module.exports.sendPatientActivationEmail = function (req, res, Paciente){
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
		var msg = req.body.message;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No patient id provided"});
	}
	var val = Math.floor(1000 + Math.random() * 9000);
	
	Paciente.update({'_id': _id}, {'activo': true, 'pin': val}, function(err, resu){
		
		Paciente.find({'_id': _id}, function(err, patient){
		
			if(err){
				return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
			}
		
			var nodemailer = require("nodemailer");

			var smtpTransport = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587, 
				secure: false,
				auth: {
					user: "lualgarnicalo@ittepic.edu.mx",
					pass: "luisgarnica11"
				}
			});

			smtpTransport.sendMail({
				from: "Nutrisha APP <lualgarnicalo@ittepic.edu.mx>", // sender address
				to: patient[0].nombre+" <"+patient[0].email+">", // comma separated list of receivers
				subject: "Enhorabuena "+patient[0].nombre, // Subject line
				text: "Bienvenido a Nutrisha APP. Mediante esta aplicación podrás dar seguimiento a tu avance en las citas con tu nutriólogo. ¡Tu cuenta ha sido Activada! Puedes acceder a ella utilizando el correo electrónico con el que te registraste y tu pin \n"+
						"Credenciales de acceso: \n\n"+
						"email: "+patient[0].email+"\n"+
						"PIN: "+val+"\n"+
						"\n\n ¡Sigue firme en tus metas y alcanza tus sueños!"+
						"Dr. Un Doctor De un Consultario \n"+
						"Consultorio del Doctor y Datos de Contacto"// plaintext body
			}, function(error, response){
				if(error){
					console.log(error);
				}else{
					console.log("Mail sent: " + response.message);
					return res.status(status.OK).json({"pin":val, "todoclarotodocorrecto":true});
				}
			});
		});
		
	});
};

module.exports.deletePatient = function (req, res, Paciente, Comida){
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
	Paciente.remove({'_id': _id}, handle.handleOne.bind(null, 'paciente', res));
};

module.exports.removePatientPantry = function(req, res, Paciente, Comida){
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
		var idComida = req.body.paciente.idComida;
		var fecha = req.body.paciente.fecha;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Comida.findOne({"_id": idComida})
		.populate({path: "ingred._id", model: "Ingrediente"}).exec(function(error, result){
			Paciente.update({"_id": _id}, {$pull: 
				{"despensa" : 
					{"fecha":fecha, 
					"comidaTiempo": result.tipo,
					"menuId" : idComida
					} 
				}
			}).exec(handle.handleOne.bind(null, 'paciente', res));
		});	
};

module.exports.updatePatient = function(req, res, Paciente){
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
		var idPaciente = req.params._id;
		var paciente = req.body.paciente;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Paciente.update({_id: idPaciente}, query, {upsert: true},function(err, resu){
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

	Paciente.find({_id: idPaciente}, function(err, patient){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!patient){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(paciente) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(paciente.nombre != undefined && patient[0].nombre != paciente.nombre){
				actualizaCampo('nombre', paciente.nombre, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(paciente.foto != undefined && patient[0].foto != paciente.foto){
				actualizaCampo('foto', paciente.foto, funcion1);
			}else{
				funcion1();
			}
		}


		var funcion3 = function(){
			if(paciente.fecha_nacimiento != undefined && patient[0].fecha_nacimiento != paciente.fecha_nacimiento){
				actualizaCampo('fecha_nacimiento', paciente.fecha_nacimiento, funcion2);
			}else{
				funcion2();
			}
		}

		var funcion4 = function(){
			if(paciente.activo != undefined && patient[0].activo != paciente.activo){
				actualizaCampo('activo', paciente.activo, funcion3);
			}else{
				funcion3();
			}
		}

		var funcion5 = function(){
			if(paciente.idCita != undefined && patient[0].idCita != paciente.idCita){
				actualizaCampo('idCita', paciente.idCita, funcion4);
			}else{
				funcion4();
			}
		}


		var funcion6 = function(){
			if(paciente.menu_asignado != undefined && patient[0].menu_asignado !== paciente.menu_asignado){
				actualizaCampo('menu_asignado', paciente.menu_asignado, funcion5);
			}else{
				funcion5();
			}
		}


		var funcion7 = function(){
			if(paciente.obesidad != undefined && patient[0].obesidad != paciente.obesidad){
				actualizaCampo('obesidad', paciente.obesidad, funcion6);
			}else{
				funcion6();
			}
		}


		var funcion8 = function(){
			if(paciente.alcohol != undefined && patient[0].alcohol != paciente.alcohol){
				actualizaCampo('alcohol', paciente.alcohol, funcion7);
			}else{
				funcion7();
			}
		}

		var funcion9 = function(){
			if(paciente.diabetes != undefined && patient[0].diabetes != paciente.diabetes){
				actualizaCampo('diabetes', paciente.diabetes, funcion8);
			}else{
				funcion8();
			}
		}


		var funcion10 = function(){
			if(paciente.colesterol != undefined && patient[0].colesterol != paciente.colesterol){
				actualizaCampo('colesterol', paciente.colesterol, funcion9);
			}else{
				funcion9();
			}
		}

		var funcion11 = function(){
			if(paciente.hipertension != undefined && patient[0].hipertension != paciente.hipertension){
				actualizaCampo('hipertension', paciente.hipertension, funcion10);
			}else{
				funcion10();
			}
		}


		var funcion12 = function(){
			if(paciente.hipotension != undefined && patient[0].hipotension != paciente.hipotension){
				actualizaCampo('hipotension', paciente.hipotension, funcion11);
			}else{
				funcion11();
			}
		}

		var funcion13 = function(){
			if(paciente.pesohabitual != undefined && patient[0].pesohabitual != paciente.pesohabitual){
				actualizaCampo('pesohabitual', paciente.pesohabitual, funcion12);
			}else{
				funcion12();
			}
		}

		var funcion14 = function(){
			if(paciente.no_gusta != undefined && patient[0].no_gusta != paciente.no_gusta){
				actualizaCampo('no_gusta', paciente.no_gusta, funcion13);
			}else{
				funcion13();
			}
		}

		var funcion15 = function(){
			if(paciente.sexo != undefined && patient[0].sexo != paciente.sexo){
				actualizaCampo('sexo', paciente.sexo, funcion14);
			}else{
				funcion14();
			}
		}

		var funcion16 = function(){
			if(paciente.lug_nacimiento != undefined && patient[0].lug_nacimiento != paciente.lug_nacimiento){
				actualizaCampo('lug_nacimiento', paciente.lug_nacimiento, funcion15);
			}else{
				funcion15();
			}
		}

		var funcion17 = function(){
			if(paciente.domicilio != undefined && patient[0].domicilio != paciente.domicilio){
				actualizaCampo('domicilio', paciente.domicilio, funcion16);
			}else{
				funcion16();
			}
		}

		var funcion18 = function(){
			if(paciente.telefono != undefined && patient[0].telefono != paciente.telefono){
				actualizaCampo('telefono', paciente.telefono, funcion17);
			}else{
				funcion17();
			}
		}

		var funcion19 = function(){
			if(paciente.patologia != undefined && patient[0].patologia != paciente.patologia){
				actualizaCampo('patologia', paciente.patologia, funcion18);
			}else{
				funcion18();
			}
		}

		var funcion20 = function(){
			if(paciente.alergia != undefined && patient[0].alergia != paciente.alergia){
				actualizaCampo('alergia', paciente.alergia, funcion19);
			}else{
				funcion19();
			}
		}

		var funcion21 = function(){
			if(paciente.tomando_medicacion != undefined && patient[0].tomando_medicacion != paciente.tomando_medicacion){
				actualizaCampo('tomando_medicacion', paciente.tomando_medicacion, funcion20);
			}else{
				funcion20();
			}
		}

		var funcion22 = function(){
			if(paciente.tratamiento != undefined && patient[0].tratamiento != paciente.tratamiento){
				actualizaCampo('tratamiento', paciente.tratamiento, funcion21);
			}else{
				funcion21();
			}
		}

		var funcion23 = function(){
			if(paciente.meta != undefined && patient[0].meta != paciente.meta){
				actualizaCampo('meta', paciente.meta, funcion22);
			}else{
				funcion22();
			}
		}

		var funcion24 = function(){
			if(paciente.email != undefined && patient[0].email != paciente.email){
				actualizaCampo('email', paciente.email, funcion23);
			}else{
				funcion23();
			}
		}

		var funcion25 = function(){
			if(paciente.PIN != undefined && patient[0].PIN != paciente.PIN){
				actualizaCampo('PIN', paciente.PIN, funcion24);
			}else{
				funcion24();
			}
		}
		var funcion26 = function(){
			if(paciente.device_key != undefined && patient[0].device_key != paciente.device_key){
				actualizaCampo('device_key',paciente.device_key,funcion25);
			}else{
				funcion25();
			}
		}
		var funcion27 = function(){
			if(paciente.presion_arterial != undefined && patient[0].presion_arterial != paciente.presion_arterial){
				actualizaCampo('presion_arterial',paciente.presion_arterial,funcion26);
			}else{
				funcion26();
			}
		}
		var funcion28 = function(){
			if(paciente.talla != undefined && patient[0].talla != paciente.talla){
				actualizaCampo('talla',paciente.talla,funcion27);
			}else{
				funcion27();
			}
		}
		var funcion29 = function(){
			if(paciente.tabaco != undefined && patient[0].tabaco != paciente.tabaco){
				actualizaCampo('tabaco',paciente.tabaco,funcion28);
			}else{
				funcion28();
			}
		}
		
		var funcion30 = function(){
			if(paciente.userconfig != undefined && patient[0].userconfig != paciente.userconfig){
				actualizaCampo('userconfig', paciente.userconfig, funcion29);
			}else{
				funcion29();
			}
		}
		
		funcion30();
	});
}
