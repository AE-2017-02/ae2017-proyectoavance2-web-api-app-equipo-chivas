var mongoose = require('mongoose').set('debug', true);
var _ = require('underscore');

module.exports = function(wagner){
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost:27017/nutrition');
	
	wagner.factory('db', function(){
		return mongoose;
	});
	
	// Aquí se declaran modelos referenciados a documentos de mongodb.
	var MenuUsuario = mongoose.model('MenuUsuario', require('./menu_usuario'), 'menuUsuarios');
	var Menu = mongoose.model('Menu', require('./menu'), 'menus');
	var Comida = mongoose.model('Comida', require('./comida'), 'comidas');
	var Ingrediente = mongoose.model('Ingrediente', require('./ingrediente'), 'ingredientes');
	var Paciente = mongoose.model('Paciente', require('./paciente'), 'pacientes');

	// Se crea un object de estos modelos llamado models

	var models = {
		MenuUsuario : MenuUsuario,
		Menu: Menu,
		Comida: Comida,
		Ingrediente: Ingrediente,
		Paciente: Paciente
	};
	
	_.each(models, function(value, key){
		wagner.factory(key, function(){
			return value;
		});
	});
}
