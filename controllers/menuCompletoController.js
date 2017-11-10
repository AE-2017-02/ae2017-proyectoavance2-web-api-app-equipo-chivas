var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getMenusUsers = function (req, res, MenuUsuario){
	MenuUsuario.find({}).exec(handle.handleMany.bind(null, 'menus_users', res));
};

module.exports.getMenuUser = function (req, res, MenuUsuario){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No menu_user id provided"});
	}
	MenuUsuario.find({'_id': _id}).exec(handle.handleOne.bind(null, 'menu_user', res));
};

module.exports.newMenuUser = function (req, res, MenuUsuario){
	try{
		var menu_user = req.body.menu_user;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No menu_user provided"});
	}
	MenuUsuario.create(menu_user, handle.handleMany.bind(null, 'menu_user', res));
};

module.exports.deleteMenuUser = function (req, res, MenuUsuario){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	MenuUsuario.remove({'_id': _id}, handle.handleOne.bind(null, 'menu_user', res));
};


module.exports.updateMenuUser = function(req, res, MenuUsuario){
	try{
		var idMenuUsuario = req.params._id;
		var menuUsuario = req.body.menu_usuario;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		MenuUsuario.update({_id: idMenuUsuario}, query, function(err, resu){
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

	MenuUsuario.find({_id: idMenuUsuario}, function(err, menuUser){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!menuUser){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(menuUsuario) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(menuUsuario.desayuno != undefined){
				if(menuUsuario.desayuno.idMenu != undefined && menuUser[0].desayuno.idMenu != menuUsuario.desayuno.idMenu){
						actualizaCampo('desayuno.idMenu', menuUsuario.desayuno.idMenu, funcion2);
				}else{
					funcion2();
				}
			}else{
				funcion4();
			}
		}

		var funcion2 = function(){
				if(menuUsuario.desayuno.hora != undefined && menuUser[0].desayuno.hora != menuUsuario.desayuno.hora){
						actualizaCampo('desayuno.hora', menuUsuario.desayuno.hora, funcion3);
				}else{
					funcion3();
				}	
	    }

		var funcion3 = function(){
				if(menuUsuario.desayuno.cumplido != undefined && menuUser[0].desayuno.cumplido != menuUsuario.desayuno.cumplido){
						actualizaCampo('desayuno.cumplido', menuUsuario.desayuno.cumplido, funcion4);
				}else{
					funcion4();
				}	
	    }

		var funcion4 = function(){
			if(menuUsuario.comida != undefined){
				if(menuUsuario.comida.idMenu != undefined && menuUser[0].comida.idMenu != menuUsuario.comida.idMenu){
						actualizaCampo('comida.idMenu', menuUsuario.comida.idMenu, funcion5);
				}else{
					funcion5();
				}
			}else{
				funcion7();
			}
		}

		var funcion5 = function(){
				if(menuUsuario.comida.hora != undefined && menuUser[0].comida.hora != menuUsuario.comida.hora){
						actualizaCampo('comida.hora', menuUsuario.comida.hora, funcion6);
				}else{
					funcion6();
				}	
	    }

		var funcion6 = function(){
				if(menuUsuario.comida.cumplido != undefined && menuUser[0].comida.cumplido != menuUsuario.comida.cumplido){
						actualizaCampo('comida.cumplido', menuUsuario.comida.cumplido, funcion7);
				}else{
					funcion7;
				}	
	    }

		var funcion7 = function(){
			if(menuUsuario.cena != undefined){
				if(menuUsuario.cena.idMenu != undefined && menuUser[0].cena.idMenu != menuUsuario.cena.idMenu){
						actualizaCampo('cena.idMenu', menuUsuario.cena.idMenu, funcion8);
				}else{
					funcion8();
				}
			}else{
				funcion10();
			}
		}

		var funcion8 = function(){
				if(menuUsuario.cena.hora != undefined && menuUser[0].cena.hora != menuUsuario.cena.hora){
						actualizaCampo('cena.hora', menuUsuario.cena.hora, funcion9);
				}else{
					funcion9();
				}	
	    }

		var funcion9 = function(){
				if(menuUsuario.cena.cumplido != undefined && menuUser[0].cena.cumplido != menuUsuario.cena.cumplido){
						actualizaCampo('cena.cumplido', menuUsuario.cena.cumplido, funcion10);
				}else{
					funcion10();
				}	
	    }


		var funcion10 = function(){
			if(menuUsuario.colacion1 != undefined){
				if(menuUsuario.colacion1.idMenu != undefined && menuUser[0].colacion1.idMenu != menuUsuario.colacion1.idMenu){
						actualizaCampo('colacion1.idMenu', menuUsuario.colacion1.idMenu, funcion11);
				}else{
					funcion11();
				}
			}else{
				funcion13();
			}
		}

		var funcion11 = function(){
				if(menuUsuario.colacion1.hora != undefined && menuUser[0].colacion1.hora != menuUsuario.colacion1.hora){
						actualizaCampo('colacion1.hora', menuUsuario.colacion1.hora, funcion12);
				}else{
					funcion12();
				}	
	    }

		var funcion12 = function(){
				if(menuUsuario.colacion1.cumplido != undefined && menuUser[0].colacion1.cumplido != menuUsuario.colacion1.cumplido){
						actualizaCampo('colacion1.cumplido', menuUsuario.colacion1.cumplido, funcion13);
				}else{
					funcion13();
				}	
	    }
	
		var funcion13 = function(){
			if(menuUsuario.colacion2 != undefined){
				if(menuUsuario.colacion2.idMenu != undefined && menuUser[0].colacion2.idMenu != menuUsuario.colacion2.idMenu){
						actualizaCampo('colacion2.idMenu', menuUsuario.colacion2.idMenu, funcion14);
				}else{
					funcion14();
				}
			}else{
				funcionfinal();
			}
		}

		var funcion14 = function(){
				if(menuUsuario.colacion2.hora != undefined && menuUser[0].colacion2.hora != menuUsuario.colacion2.hora){
						actualizaCampo('colacion2.hora', menuUsuario.colacion2.hora, funcion15);
				}else{
					funcion15();
				}	
	    }

		var funcion15 = function(){
				if(menuUsuario.colacion2.cumplido != undefined && menuUser[0].colacion2.cumplido != menuUsuario.colacion2.cumplido){
						actualizaCampo('colacion2.cumplido', menuUsuario.colacion2.cumplido, funcionfinal);
				}else{
					funcionfinal();
				}	
	    }

		funcion1();
	});
}



