var mongoose = require('mongoose').set('debug', true);
var _require('underscore');

module.exports = function(wagner){
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost:27017/nutrition');
	
	wagner.factory('db', function(){
		return mongoose;
	});
	
	// Aquí se declaran modelos referenciados a documentos de mongodb.
	
	// Se crea un object de estos modelos llamado models
	var models = {};
	
	_.each(models, function(value, key){
		wagner.factory(key, function(){
			return value;
		});
	});
}