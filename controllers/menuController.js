var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getMenus = function (req, res, Menu){
	Menu.find({}).exec(handle.handleMany.bind(null, 'menus', res));
};

module.exports.getMenu = function (req, res, Menu){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No menu id provided"});
	}
	Menu.find({'_id': _id}).exec(handle.handleOne.bind(null, 'menu', res));
};

module.exports.newMenu = function (req, res, Menu){
	try{
		var menu = req.body.menu;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No menu provided"});
	}
	Menu.create(menu, handle.handleMany.bind(null, 'menu', res));
};

module.exports.deleteMenu = function (req, res, Menu){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Menu.remove({'_id': _id}, handle.handleOne.bind(null, 'menu', res));
};

module.exports.updateMenu = function(req, res, Menu){
	try{
		var idMenu = req.params._id;
		var menu = req.body.menu;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Menu.update({_id: idMenu}, query, function(err, resu){
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

	Menu.find({_id: idMenu}, function(err, menus){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!menus){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(menu) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(menu.nombre != undefined && menus[0].nombre != menu.nombre){
				actualizaCampo('nombre', menu.nombre, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(menu.comidas != undefined && menus[0].comidas != menu.comidas){
				actualizaCampo('comidas', menu.comidas, funcion1);
			}else{
				funcion1();
			}
		}	

		var funcion3 = function(){
			if(menu.tipo != undefined && menus[0].tipo != menu.tipo){
				actualizaCampo('tipo', menu.tipo, funcion2);
			}else{
				funcion2();
			}
		}

		funcion3();
	});
}
