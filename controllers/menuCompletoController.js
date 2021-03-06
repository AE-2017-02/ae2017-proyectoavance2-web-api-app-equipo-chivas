var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
module.exports.getMenusUsers = function (req, res, MenuUsuario) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	MenuUsuario.find({}).exec(handle.handleMany.bind(null, 'menus_users', res));
};

module.exports.getMenuUser = function (req, res, MenuUsuario) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	try {
		var _id = req.params._id;
	} catch (e) {
		return res.status(status.BAD_REQUEST).json({ error: "No menu_user id provided" });
	}
	MenuUsuario.find({ '_id': _id }).exec(handle.handleOne.bind(null, 'menu_user', res));
};

module.exports.getMenuUserWithData = function (req, res, MenuUsuario) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	try {
		var _id = req.params._id;
	} catch (e) {
		return res.status(status.BAD_REQUEST).json({ error: "No menu_user id provided" });
	}
	MenuUsuario.find({ '_id': _id })
		.populate({
			path: "desayuno.idMenu", model: "Menu", populate: [
				{
					path: "comidas", model: "Comida", populate: [
						{ path: "ingred._id", model: "Ingrediente" }
					]
				}
			]
		})
		.populate({
			path: "comida.idMenu", model: "Menu", populate: [
				{
					path: "comidas", model: "Comida", populate: [
						{ path: "ingred._id", model: "Ingrediente" }
					]
				}
			]
		})
		.populate({
			path: "cena.idMenu", model: "Menu", populate: [
				{
					path: "comidas", model: "Comida", populate: [
						{ path: "ingred._id", model: "Ingrediente" }
					]
				}
			]
		})
		.populate({
			path: "colacion1.idMenu", model: "Menu", populate: [
				{
					path: "comidas", model: "Comida", populate: [
						{ path: "ingred._id", model: "Ingrediente" }
					]
				}
			]
		})
		.populate({
			path: "colacion2.idMenu", model: "Menu", populate: [
				{
					path: "comidas", model: "Comida", populate: [
						{ path: "ingred._id", model: "Ingrediente" }
					]
				}
			]
		}).exec(handle.handleOne.bind(null, 'menu_user', res));
}

module.exports.newMenuUser = function (req, res, MenuUsuario) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	try {
		var menu_user = req.body.menu_user;
	} catch (e) {
		return res.status(status.BAD_REQUEST).json({ error: "No menu_user provided" });
	}
	MenuUsuario.create(menu_user, handle.handleMany.bind(null, 'menu_user', res));
};


module.exports.newMenuUserComplete = function (req, res, MenuUsuario, Menu, Paciente) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	try {
		var menu_user = req.body.menu_usuario;
		var idUser = req.params.patient;
	} catch (e) {
		return res.status(status.BAD_REQUEST).json({ error: "No menu_user provided" });
	}

	var funcion10 = function(){
		var desayuno = {
			"idMenu": desayunoId,
			"hora": menu_user.desayuno.hora,
			"cumplido": menu_user.desayuno.cumplido
		}

		var comida = {
			"idMenu": comidaId,
			"hora": menu_user.comida.hora,
			"cumplido": menu_user.comida.cumplido
		}
		var cena = {
			"idMenu": cenaId,
			"hora": menu_user.cena.hora,
			"cumplido": menu_user.cena.cumplido
		}
		var colacion1 = {
			"idMenu": colacion1Id,
			"hora": menu_user.colacion1.hora,
			"cumplido": menu_user.colacion1.cumplido
		}
		var colacion2 = {
			"idMenu": colacion2Id,
			"hora": menu_user.colacion2.hora,
			"cumplido": menu_user.colacion2.cumplido			
		}

		var menucompleto = {
			"menu_usuario": {
			}
		}		

		if(menu_user.desayuno != undefined){
			menucompleto.menu_usuario.desayuno = desayuno;	
		}
		if(menu_user.comida != undefined){
			menucompleto.menu_usuario.comida = comida;
		}
		if(menu_user.cena != undefined){
			menucompleto.menu_usuario.cena = cena;
		}
		if(menu_user.colacion1 != undefined){
			menucompleto.menu_usuario.colacion1 = colacion1;
		}
		if(menu_user.colacion2 != undefined){
			menucompleto.menu_usuario.colacion2 = colacion2;
		}
		
		console.log(menucompleto);
		MenuUsuario.create(menucompleto.menu_usuario, function (err, result){
			if(err){
				return res.status(status.INTERNAL_SERVER_ERROR).json({"error": err});
			}
			console.log(result);
			console.log(result._id);
			console.log(idUser);
			Paciente.findOneAndUpdate({"_id":idUser}, {$set:{"menu_asignado":[result._id]}}, {new: true}).exec(handle.handleOne.bind(null, 'patient', res));
		});
	}	

	var funcion9 = function () {
		var colacion2 = {
				"nombre": menu_user.colacion2.nombre,
				"comidas": menu_user.colacion2.comidas,
				"tipo": menu_user.colacion2.tipo
		}
		Menu.create(colacion2, function (err, result) {
			if (err) {
				return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
			}
			colacion2Id = result._id;
			funcion10();
		});
	}

	var funcion8 = function () {
		if (menu_user.colacion2 != undefined) {
			funcion9();
		} else {
			funcion10();
		}
	}	

	var funcion7 = function () {
		var colacion1 = {
				"nombre": menu_user.colacion1.nombre,
				"comidas": menu_user.colacion1.comidas,
				"tipo": menu_user.colacion1.tipo
		}
		Menu.create(colacion1, function (err, result) {
			if (err) {
				return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
			}
			colacion1Id = result._id;
			funcion8();
		});
	}	

	var funcion6 = function () {
		if (menu_user.colacion1 != undefined) {
			funcion7();
		} else {
			funcion8();
		}
	}	

	var funcion5 = function () {
		var cena = {
			
				"nombre": menu_user.cena.nombre,
				"comidas": menu_user.cena.comidas,
				"tipo": menu_user.cena.tipo
		
		}
		Menu.create(cena, function (err, result) {
			if (err) {
				return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
			}
			cenaId = result._id;
			funcion6();
		});
	}	

	var funcion4 = function () {
		if (menu_user.cena != undefined) {
			funcion5();
		} else {
			funcion6();
		}
	}	

	var funcion3 = function () {
		var comida = {
	
				"nombre": menu_user.comida.nombre,
				"comidas": menu_user.comida.comidas,
				"tipo": menu_user.comida.tipo
			
		}
		Menu.create(comida, function (err, result) {
			if (err) {
				return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
			}
			comidaId = result._id;
			funcion4();
		});
	}

	var funcion2 = function () {
		if (menu_user.comida != undefined) {
			funcion3();
		} else {
			funcion4();
		}
	}	

	var funcion1 = function () {
		var desayuno = {
	
				"nombre": menu_user.desayuno.nombre,
				"comidas": menu_user.desayuno.comidas,
				"tipo": menu_user.desayuno.tipo
	
		}

		Menu.create(desayuno, function (err, result) {
			if (err) {
				return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
			}
			desayunoId = result._id;
			funcion2();
		});
	}	

	if (menu_user.desayuno != undefined) {
		funcion1();
	} else {
		funcion2();
	}
};

module.exports.deleteMenuUser = function (req, res, MenuUsuario) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	try {
		var _id = req.params._id;
	} catch (e) {
		return res.status(status.BAD_REQUEST).json({ error: e.toString() });
	}
	MenuUsuario.remove({ '_id': _id }, handle.handleOne.bind(null, 'menu_user', res));
};


module.exports.updateMenuUser = function (req, res, MenuUsuario) {
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	console.log(token);
	if (token) {
		try {
			var decoded = jwt.decode(token, 'GarnicaUltraSecretKey');

			if (decoded.exp <= Date.now()) {
				return res.end('Access token has expired', 400);
			};
		} catch (err) {
			return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
		}
	} else {
		return res.status(status.FORBIDDEN).json({ error: 'No valid access token provided' });
	}
	try {
		var idMenuUsuario = req.params._id;
		var menuUsuario = req.body.menu_usuario;
		var count = 0;
		var camposActualizados = "";
	} catch (e) {
		return res.status(status.BAD_REQUEST).json({ error: e.toString() })
	}

	var actualizaCampo = function (campo, valor, funcion) {
		var query = { '$set': {} };
		query['$set'][campo] = valor;
		MenuUsuario.update({ _id: idMenuUsuario }, query, function (err, resu) {
			if (err) {
				return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
			}
			if (!resu) {
				return res.status(status.NOT_FOUND).json({ error: 'Not found' });
			}
			camposActualizados += campo + " ";
			count++;
			funcion();
		});
	};

	MenuUsuario.find({ _id: idMenuUsuario }, function (err, menuUser) {

		if (err) {
			return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
		}

		if (!menuUser) {
			return res.status(status.NOT_FOUND).json({ error: 'Not found' });
		}

		var funcionfinal = function () {
			console.log('funcion final');
			if (_.isEmpty(menuUsuario) || count == 0) {
				return res.status(status.BAD_REQUEST).json({ error: 'Not actualizable fields' });
			}

			res.status(status.OK).json({ mensaje: camposActualizados });
		}

		var funcion1 = function () {
			console.log('funcion 1');
			if (menuUsuario.desayuno != undefined) {
				if (menuUsuario.desayuno.idMenu != undefined && menuUser[0].desayuno.idMenu != menuUsuario.desayuno.idMenu) {
					actualizaCampo('desayuno.idMenu', menuUsuario.desayuno.idMenu, funcion2);
				} else {
					funcion2();
				}
			} else {
				funcion4();
			}
		}

		var funcion2 = function () {
			console.log('funcion 2');
			if (menuUsuario.desayuno.hora != undefined && menuUser[0].desayuno.hora != menuUsuario.desayuno.hora) {
				actualizaCampo('desayuno.hora', menuUsuario.desayuno.hora, funcion3);
			} else {
				funcion3();
			}
		}

		var funcion3 = function () {
			console.log('funcion 3');
			if (menuUsuario.desayuno.cumplido != undefined && menuUser[0].desayuno.cumplido != menuUsuario.desayuno.cumplido) {
				actualizaCampo('desayuno.cumplido', menuUsuario.desayuno.cumplido, funcion4);
			} else {
				funcion4();
			}
		}

		var funcion4 = function () {
			console.log('funcion 4');
			if (menuUsuario.comida != undefined) {
				if (menuUsuario.comida.idMenu != undefined && menuUser[0].comida.idMenu != menuUsuario.comida.idMenu) {
					actualizaCampo('comida.idMenu', menuUsuario.comida.idMenu, funcion5);
				} else {
					funcion5();
				}
			} else {
				funcion7();
			}
		}

		var funcion5 = function () {
			console.log('funcion 5');
			if (menuUsuario.comida.hora != undefined && menuUser[0].comida.hora != menuUsuario.comida.hora) {
				actualizaCampo('comida.hora', menuUsuario.comida.hora, funcion6);
			} else {
				funcion6();
			}
		}

		var funcion6 = function () {
			console.log('funcion 6');
			if (menuUsuario.comida.cumplido != undefined && menuUser[0].comida.cumplido != menuUsuario.comida.cumplido) {
				actualizaCampo('comida.cumplido', menuUsuario.comida.cumplido, funcion7);
			} else {
				funcion7();
			}
		}

		var funcion7 = function () {
			console.log('funcion 7');
			if (menuUsuario.cena != undefined) {
				if (menuUsuario.cena.idMenu != undefined && menuUser[0].cena.idMenu != menuUsuario.cena.idMenu) {
					actualizaCampo('cena.idMenu', menuUsuario.cena.idMenu, funcion8);
				} else {
					funcion8();
				}
			} else {
				funcion10();
			}
		}

		var funcion8 = function () {
			console.log('funcion 8');
			if (menuUsuario.cena.hora != undefined && menuUser[0].cena.hora != menuUsuario.cena.hora) {
				actualizaCampo('cena.hora', menuUsuario.cena.hora, funcion9);
			} else {
				funcion9();
			}
		}

		var funcion9 = function () {
			console.log('funcion 9');
			if (menuUsuario.cena.cumplido != undefined && menuUser[0].cena.cumplido != menuUsuario.cena.cumplido) {
				actualizaCampo('cena.cumplido', menuUsuario.cena.cumplido, funcion10);
			} else {
				funcion10();
			}
		}


		var funcion10 = function () {
			console.log('funcion 10');
			if (menuUsuario.colacion1 != undefined) {
				if (menuUsuario.colacion1.idMenu != undefined && menuUser[0].colacion1.idMenu != menuUsuario.colacion1.idMenu) {
					actualizaCampo('colacion1.idMenu', menuUsuario.colacion1.idMenu, funcion11);
				} else {
					funcion11();
				}
			} else {
				funcion13();
			}
		}

		var funcion11 = function () {
			console.log('funcion 11');
			if (menuUsuario.colacion1.hora != undefined && menuUser[0].colacion1.hora != menuUsuario.colacion1.hora) {
				actualizaCampo('colacion1.hora', menuUsuario.colacion1.hora, funcion12);
			} else {
				funcion12();
			}
		}

		var funcion12 = function () {
			console.log('funcion 12');
			if (menuUsuario.colacion1.cumplido != undefined && menuUser[0].colacion1.cumplido != menuUsuario.colacion1.cumplido) {
				actualizaCampo('colacion1.cumplido', menuUsuario.colacion1.cumplido, funcion13);
			} else {
				funcion13();
			}
		}

		var funcion13 = function () {
			console.log('funcion 13');
			if (menuUsuario.colacion2 != undefined) {
				if (menuUsuario.colacion2.idMenu != undefined && menuUser[0].colacion2.idMenu != menuUsuario.colacion2.idMenu) {
					actualizaCampo('colacion2.idMenu', menuUsuario.colacion2.idMenu, funcion14);
				} else {
					funcion14();
				}
			} else {
				funcionfinal();
			}
		}

		var funcion14 = function () {
			console.log('funcion 14');
			if (menuUsuario.colacion2.hora != undefined && menuUser[0].colacion2.hora != menuUsuario.colacion2.hora) {
				actualizaCampo('colacion2.hora', menuUsuario.colacion2.hora, funcion15);
			} else {
				funcion15();
			}
		}

		var funcion15 = function () {
			console.log('funcion 15');
			if (menuUsuario.colacion2.cumplido != undefined && menuUser[0].colacion2.cumplido != menuUsuario.colacion2.cumplido) {
				actualizaCampo('colacion2.cumplido', menuUsuario.colacion2.cumplido, funcionfinal);
			} else {
				funcionfinal();
			}
		}

		funcion1();
	});
}

