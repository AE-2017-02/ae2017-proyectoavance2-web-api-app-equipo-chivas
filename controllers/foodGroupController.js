var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');
// var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');

module.exports.getFoodGroups = function (req,res,GrupoAlimento){
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
    
    GrupoAlimento.find({}).exec(handle.handleMany.bind(null,'foodGroups',res));
};

module.exports.getFoodGroupById = function (req,res,GrupoAlimento){
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
        return res.status(status.BAD_REQUEST).json({error: "No ingredient id provided"});
    }
        GrupoAlimento.find({'_id':_id}).exec(handle.handleOne.bind(null,'foodGroup',res));
};


module.exports.updateFoodGroup = function (req, res, GrupoAlimento){
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
        var grupoAlimento = req.body.foodGroup;
        var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No food group provided"});
	}
	GrupoAlimento.findByIdAndUpdate(_id,grupoAlimento,{new:true}, handle.handleOne.bind(null, 'foodGroup', res));
};

module.exports.removeFoodGroup = function (req, res, GrupoAlimento){
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
		return res.status(status.BAD_REQUEST).json({error: "No food group provided"});
	}
	GrupoAlimento.findByIdAndRemove(_id, handle.handleOne.bind(null, 'foodGroup', res));
};

module.exports.newFoodGroup = function (req, res, GrupoAlimento){
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
		var grupoAlimento = req.body.foodGroup;
		console.log(grupoAlimento);
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No food group provided"});
	}
	GrupoAlimento.create(grupoAlimento, handle.handleMany.bind(null, 'foodGroup', res));
};
