var status = require('http-status');
var handle = require('./../utils/handle');
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var _ = require('underscore');

module.exports.getIngredients = function (req, res, Ingrediente){
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
	
	Ingrediente.find({}).populate('grupoAlimento').exec(handle.handleMany.bind(null, 'ingredientes', res));
};

module.exports.getIngredient = function (req, res, Ingrediente){
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
	Ingrediente.find({'_id': _id}).populate('grupoAlimento').exec(handle.handleOne.bind(null, 'ingrediente', res));
};

module.exports.getIngredientsForUser = function(req, res, Ingrediente, Paciente, MenuUsuario, Menu, Comida){
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
		return res.status(status.BAD_REQUEST).json({error: "No User Id provide"});
	}
	
	var objeto = [];
	
	Paciente.find({'_id': _id}, function(error, result){
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
		}
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not Found'});
		}
		
		var longitude = 0;
		
		result[0].menu_asignado.forEach(function(element) {			
			MenuUsuario.find({'_id': element}, function(error, resulta){
				longitude = longitude + 1;
				if(error){
					return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
				}
				if(!resulta){
					return res.status(status.NOT_FOUND).json({error: 'Not Found'});
				}			
				
				if(resulta[0].desayuno != undefined){
					console.log(resulta[0].desayuno);
					Menu.find({'_id': resulta[0].desayuno.idMenu}, function(error, resulta1){
						
						if(error){
							return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
						}
						if(!resulta1){
							return res.status(status.NOT_FOUND).json({error: 'Not Found'});
						}						
						var l1 = 0;
						resulta1[0].comidas.forEach(function(element) {						
							Comida.find({'_id': element}, function(error, resultad1){
								l1 = l1 + 1;
								if(error){
									return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
								}
								if(!resultad1){
									return res.status(status.NOT_FOUND).json({error: 'Not Found'});
								}
								var l2 = 0;
								resultad1[0].ingred.forEach(function(element){
									Ingrediente.find({'_id': element.idIngred}, function (error, resultado1){
										l2 = l2 + 1;
										if(error){
											return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
										}
										if(!resultado1){
											return res.status(status.NOT_FOUND).json({error: 'Not Found'});
										}
									
										var longitud1 = 0;
										console.log(resultado1);
										resultado1.forEach(function(elemento){
										
											longitud1 = longitud1 + 1;
										
											var objetoTemp = [];
				
											objetoTemp.ingredNombre = elemento.nombre;
											objetoTemp.ingredId = elemento._id;

											if(objeto.indexOf(objetoTemp) == -1){
												objeto.push(objetoTemp);
											}
											
											if(longitud1 == resultado1.length && l1 == resulta1[0].comidas.length && l2 == resultad1[0].ingred.length){	
												funcion_1();
											}
										});
									});
								});
							});	
						});
					});
				}else{
					if(longitude == result[0].menu_asignado.length){
						funcion_1();	
					}
				}
				
				function funcion_1(){
					console.log(resulta[0].comida);
					if(resulta[0].comida != undefined){
						Menu.find({'_id': resulta[0].comida.idMenu}, function(error, resulta2){
							if(error){
								return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
							}
							if(!resulta2){
								return res.status(status.NOT_FOUND).json({error: 'Not Found'});
							}						
							var l3 = 0;
							resulta2[0].comidas.forEach(function(element) {						
								Comida.find({'_id': element}, function(error, resultad2){
									l3 = l3 +1;
									if(error){
										return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
									}
									if(!resultad2){
										return res.status(status.NOT_FOUND).json({error: 'Not Found'});
									}
									var l4 = 0;
									resultad2[0].ingred.forEach(function(element){
										Ingrediente.find({'_id': element.idIngred}, function (error, resultado2){
											l4 = l4 +1;
											if(error){
												return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
											}
											if(!resultado2){
												return res.status(status.NOT_FOUND).json({error: 'Not Found'});
											}
											
											var longitud2 = 0;
											
											resultado2.forEach(function(elemento){
												longitud2 = longitud2 + 1;
												var objetoTemp = [];
				
												objetoTemp.ingredNombre = elemento.nombre;
												objetoTemp.ingredId = elemento._id;

												if(objeto.indexOf(objetoTemp) == -1){
													objeto.push(objetoTemp);
												}
												if(longitud2 == resultado2.length && resulta2[0].comidas.length == l3 && resultad2[0].ingred == l4){
													funcion2();
												}
											});
										});
									});
								});	
							});						
						});
					}else{
						funcion2();
					}
				}
				
				function funcion2(){
					console.log(resulta[0].cena);
					if(resulta[0].cena != undefined){
						
						Menu.find({'_id': resulta[0].cena.idMenu}, function(error, resulta3){
							if(error){
								return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
							}
							if(!resulta3){
								return res.status(status.NOT_FOUND).json({error: 'Not Found'});
							}						
						
							resulta3[0].comidas.forEach(function(element) {						
								Comida.find({'_id': element}, function(error, resultad3){

									if(error){
										return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
									}
									if(!resultad3){
										return res.status(status.NOT_FOUND).json({error: 'Not Found'});
									}

									resultad3[0].ingred.forEach(function(element){
										Ingrediente.find({'_id': element.idIngred}, function (error, resultado3){
										
											if(error){
												return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
											}
											if(!resultado3){
												return res.status(status.NOT_FOUND).json({error: 'Not Found'});
											}
											
											var longitud3 = 0;
									
											resultado3.forEach(function(elemento){
												
												longitud3 = longitud3 + 1;
												
												var objetoTemp = [];
				
												objetoTemp.ingredNombre = elemento.nombre;
												objetoTemp.ingredId = elemento._id;

												if(objeto.indexOf(objetoTemp) == -1){
													objeto.push(objetoTemp);
												}
												if(longitud3 == resultado3.length){
													funcion3();
												}
											});
										});
									});
								});	
							});				
						});
					}else{
						funcion3();
					}
				}
				
				function funcion3(){
					console.log("colacion1");
					if(resulta[0].colacion1 != undefined){
						Menu.find({'_id': resulta[0].colacion1.idMenu}, function(error, resulta4){
							if(error){
								return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
							}
							if(!resulta4){
								return res.status(status.NOT_FOUND).json({error: 'Not Found'});
							}						
						
							resulta4[0].comidas.forEach(function(element) {						
								Comida.find({'_id': element}, function(error, resultad){

									if(error){
										return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
									}
									if(!resultad){
										return res.status(status.NOT_FOUND).json({error: 'Not Found'});
									}

									resultad[0].ingred.forEach(function(element){
										Ingrediente.find({'_id': element.idIngred}, function (error, resultado4){
										
											if(error){
												return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
											}
											if(!resultado4){
												return res.status(status.NOT_FOUND).json({error: 'Not Found'});
											}
											
											var longitud4 = 0;
									
											resultado4.forEach(function(elemento){
												
												longitud4 = longitud4 + 1;
												
												var objetoTemp = [];
				
												objetoTemp.ingredNombre = elemento.nombre;
												objetoTemp.ingredId = elemento._id;

												if(objeto.indexOf(objetoTemp) == -1){
													objeto.push(objetoTemp);
												}
												if(longitud4 == resultado4.length){
													funcion4();
												}
											});
										});
									});
								});	
							});				
						});
					}else{
						funcion4();
					}						
				}
				
				function funcion4(){
					console.log("colacion2");
					if(resulta[0].colacion2 != undefined){
						Menu.find({'_id': resulta[0].colacion2.idMenu}, function(error, resulta5){
							if(error){
								return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
							}
							if(!resulta5){
								return res.status(status.NOT_FOUND).json({error: 'Not Found'});
							}

							var longitu = 0;
						
							resulta5[0].comidas.forEach(function(element) {	
							
								
								Comida.find({'_id': element}, function(error, resultad){
									longitu = longitu + 1;
									console.log(longitu);
									if(error){
										return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
									}
									if(!resultad){
										return res.status(status.NOT_FOUND).json({error: 'Not Found'});
									}
									
									var longi = 0;

									resultad[0].ingred.forEach(function(element){
										
										Ingrediente.find({'_id': element.idIngred}, function (error, resultado5){
											longi = longi + 1;
											if(error){
												return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
											}
											if(!resultado5){
												return res.status(status.NOT_FOUND).json({error: 'Not Found'});
											}
											
											var longitud5 = 0;
									
											resultado5.forEach(function(elemento){
												
												longitud5 = longitud5 + 1;
												
												var objetoTemp = [];
												
												objetoTemp.ingredNombre = elemento.nombre;
												objetoTemp.ingredId = elemento._id;
												
												if(objeto.indexOf(objetoTemp) == -1){
													objeto.push(objetoTemp);
												}
												if(longitud5 == resultado5.length && longi == resultad[0].ingred.length && longitu == resulta5[0].comidas.length && result[0].menu_asignado.length == longitude){
													console.log("entró");
													funcion5();
												}
											});
										});
									});
								});	
							});				
						});
					}else{
						if(longitude == result[0].menu_asignado.length){
							funcion5();	
						}
					}
				}
				
				function funcion5(){
					return res.status(status.OK).json({value:objeto});
				}
			});
		});
	});
}

module.exports.newIngredient = function (req, res, Ingrediente){
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
		var ingrediente = req.body.ingrediente;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No ingredient provided"});
	}
	Ingrediente.create(ingrediente, handle.handleMany.bind(null, 'ingrediente', res));
};

module.exports.deleteIngredient = function (req, res, Ingrediente){
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
	Ingrediente.remove({'_id': _id}, handle.handleOne.bind(null, 'ingrediente', res));
};


module.exports.updateIngredient = function(req, res, Ingrediente){
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
			if(ingrediente.porcion != undefined && ingredient[0].porcion != ingrediente.porcion){
				actualizaCampo('porcion', ingrediente.porcion, funcion3);
			}else{
				funcion3();
			}
		}

		var funcion3 = function(){
			if(ingrediente.grupoAlimento != undefined && ingredient[0].grupoAlimento != ingrediente.grupoAlimento){
				actualizaCampo('grupoAlimento', ingrediente.grupoAlimento, funcion4);
			}else{
				funcion4();
			}
		}
		
		var funcion4 = function(){
			if(ingrediente.unitMeasure != undefined && ingredient[0].unitMeasure != ingrediente.unitMeasure){
				actualizaCampo('unitMeasure', ingrediente.unitMeasure, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		funcion1();
	});
}