var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getUsers = function (req, res, Usuario){
	Usuario.find({}).exec(handle.handleMany.bind(null, 'usuarios', res));
};

module.exports.getUser = function (req, res, Usuario){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No user id provided"});
	}
	Usuario.find({'_id': _id}).exec(handle.handleOne.bind(null, 'usuario', res));
};

module.exports.login = function (req, res,Usuario){
	try{
		var username = req.body.username;
		var password = req.body.password;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No user id provided"});
	}
	Usuario.find({'username': username,'password':password}).exec(handle.handleOne.bind(null, 'usuario', res));
}

module.exports.newUser = function (req, res, Usuario){
	try{
		var usuario = req.body.usuario;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No user provided"});
	}
	Usuario.create(usuario, handle.handleMany.bind(null, 'usuario', res));
};

module.exports.deleteUser = function (req, res, Usuario){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Usuario.remove({'_id': _id}, handle.handleOne.bind(null, 'usuario', res));
};

module.exports.updateUser = function(req, res, Usuario){
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

		funcion2();
	});
}