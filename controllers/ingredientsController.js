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
