var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getFoods = function (req, res, Comida){
	Comida.find({}).exec(handle.handleMany.bind(null, 'comidas', res));
};

module.exports.getFood = function (req, res, Comida){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No food id provided"});
	}
	Comida.find({'_id': _id}).exec(handle.handleOne.bind(null, 'comida', res));
};

module.exports.newFood = function (req, res, Comida){
	try{
		var comida = req.body.comida;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No food provided"});
	}
	Comida.create(comida, handle.handleMany.bind(null, 'comida', res));
};

module.exports.deleteFood = function (req, res, Comida){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Comida.remove({'_id': _id}, handle.handleOne.bind(null, 'comida', res));
};
