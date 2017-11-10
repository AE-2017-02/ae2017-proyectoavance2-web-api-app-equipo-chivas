var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getIngredients = function (req, res, Ingrediente){
	Ingrediente.find({}).exec(handle.handleMany.bind(null, 'ingredientes', res));
};

module.exports.getIngredient = function (req, res, Ingrediente){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ingredient id provided"});
	}
	Ingrediente.find({'_id': _id}).exec(handle.handleOne.bind(null, 'ingrediente', res));
};

module.exports.newIngredient = function (req, res, Ingrediente){
	try{
		var ingrediente = req.body.ingrediente;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ingredient provided"});
	}
	Ingrediente.create(ingrediente, handle.handleMany.bind(null, 'ingrediente', res));
};

module.exports.deleteIngredient = function (req, res, Ingrediente){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Ingrediente.remove({'_id': _id}, handle.handleOne.bind(null, 'ingrediente', res));
};


module.exports.updateIngredient = function(req, res, Ingrediente){
	try{
		var idIngrediente = req.params._id;
		var ingrediente = req.body.ingrediente;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Ingrediente.update({_id: idIngrediente}, query, function(err, resu){
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

	Ingrediente.find({_id: idIngrediente}, function(err, ingredient){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!ingredient){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(ingrediente) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(ingrediente.nombre != undefined && ingredient[0].nombre != ingrediente.nombre){
				actualizaCampo('nombre', ingrediente.nombre, funcion2);
			}else{
				funcion2();
			}
		}
		
		var funcion2 = function(){
			if(ingrediente.calorias != undefined && ingredient[0].calorias != ingrediente.calorias){
				actualizaCampo('calorias', ingrediente.calorias, funcion3);
			}else{
				funcion3();
			}
		}
		
		var funcion3 = function(){
			if(ingrediente.unitMeasure != undefined && ingredient[0].unitMeasure != ingrediente.unitMeasure){
				actualizaCampo('unitMeasure', ingrediente.unitMeasure, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		funcion1();
	});
}