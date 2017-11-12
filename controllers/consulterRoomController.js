var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getConsulterRooms = function (req, res, Consultorio){
	Consultorio.find({}).exec(handle.handleMany.bind(null, 'consultorios', res));
};

module.exports.getConsulterRoom = function (req, res, Consultorio){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ConsulterRoom id provided"});
	}
	Consultorio.find({'_id': _id}).exec(handle.handleOne.bind(null, 'consultorio', res));
};

module.exports.newConsulterRoom = function (req, res, Consultorio){
	try{
		var consultorio = req.body.consultorio;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ConsulterRoom provided"});
	}
	Consultorio.create(consultorio, handle.handleMany.bind(null, 'consultorio', res));
};

module.exports.deleteConsulterRoom = function (req, res, Consultorio){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Consultorio.remove({'_id': _id}, handle.handleOne.bind(null, 'consultorio', res));
};

module.exports.updateConsulterRoom = function(req, res, Consultorio){
	try{
		var idConsultorio = req.params._id;
		var consultorio = req.body.consultorio;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Consultorio.update({_id: idConsultorio}, query, function(err, resu){
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

	Consultorio.find({_id: idConsultorio}, function(err, consulterRoom){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!consulterRoom){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(consultorio) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(consultorio.nombre != undefined && consulterRoom[0].nombre != consultorio.nombre){
				actualizaCampo('nombre', consultorio.nombre, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(consultorio.logo != undefined && consulterRoom[0].logo != consultorio.logo){
				actualizaCampo('logo', consultorio.logo, funcion1);
			}else{
				funcion1();
			}
		}
        
        var funcion3 = function(){
			if(consultorio.direccion != undefined && consulterRoom[0].direccion != consultorio.direccion){
				actualizaCampo('direccion', consultorio.direccion, funcion2);
			}else{
				funcion2();
			}
		}

        var funcion4 = function(){
			if(consultorio.telefono != undefined && consulterRoom[0].telefono != consultorio.telefono){
				actualizaCampo('telefono', consultorio.telefono, funcion3);
			}else{
				funcion3();
			}
		}

		funcion4();
	});
}