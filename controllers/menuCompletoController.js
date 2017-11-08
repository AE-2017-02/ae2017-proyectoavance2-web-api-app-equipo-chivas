var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getMenusUsers = function (req, res, MenuUsuario){
	MenuUsuario.find({}).exec(handle.handleMany.bind(null, 'menus_users', res));
};

module.exports.getMenuUser = function (req, res, MenuUsuario){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No menu_user id provided"});
	}
	MenuUsuario.find({'_id': _id}).exec(handle.handleOne.bind(null, 'menu_user', res));
};

module.exports.newMenuUser = function (req, res, MenuUsuario){
	try{
		var menu_user = req.body.menu_user;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No menu_user provided"});
	}
	MenuUsuario.create(menu_user, handle.handleMany.bind(null, 'menu_user', res));
};

module.exports.deleteMenuUser = function (req, res, MenuUsuario){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	MenuUsuario.remove({'_id': _id}, handle.handleOne.bind(null, 'menu_user', res));
};

/*module.exports.updateMenuUser = function(req, res, MenuUsuario){
	try{
		var idPaciente = req.params._id;
		var paciente = req.body.paciente;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Paciente.update({_id: idPaciente}, query, function(err, resu){
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

	Paciente.find({_id: idPaciente}, function(err, patient){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!patient){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(paciente) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(paciente.nombre != undefined && patient[0].nombre != paciente.nombre){
				actualizaCampo('nombre', paciente.nombre, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(paciente.foto != undefined && patient[0].foto != paciente.foto){
				actualizaCampo('foto', paciente.foto, funcion1);
			}else{
				funcion1();
			}
		}


		var funcion3 = function(){
			if(paciente.fecha_nacimiento != undefined && patient[0].fecha_nacimiento != paciente.fecha_nacimiento){
				actualizaCampo('fecha_nacimiento', paciente.fecha_nacimiento, funcion2);
			}else{
				funcion2();
			}
		}

		var funcion4 = function(){
			if(paciente.activo != undefined && patient[0].activo != paciente.activo){
				actualizaCampo('activo', paciente.activo, funcion3);
			}else{
				funcion3();
			}
		}

		var funcion5 = function(){
			if(paciente.idCita != undefined && patient[0].idCita != paciente.idCita){
				actualizaCampo('idCita', paciente.idCita, funcion4);
			}else{
				funcion4();
			}
		}


		var funcion6 = function(){
			if(paciente.menu_asignado != undefined && patient[0].menu_asignado !== paciente.menu_asignado){
				actualizaCampo('menu_asignado', paciente.menu_asignado, funcion5);
			}else{
				funcion5();
			}
		}


		var funcion7 = function(){
			if(paciente.Obesidad != undefined && patient[0].Obesidad != paciente.Obesidad){
				actualizaCampo('Obesidad', paciente.Obesidad, funcion6);
			}else{
				funcion6();
			}
		}


		var funcion8 = function(){
			if(paciente.alcohol != undefined && patient[0].alcohol != paciente.alcohol){
				actualizaCampo('alcohol', paciente.alcohol, funcion7);
			}else{
				funcion7();
			}
		}

		var funcion9 = function(){
			if(paciente.diabetes != undefined && patient[0].diabetes != paciente.diabetes){
				actualizaCampo('diabetes', paciente.diabetes, funcion8);
			}else{
				funcion8();
			}
		}


		var funcion10 = function(){
			if(paciente.colesterol != undefined && patient[0].colesterol != paciente.colesterol){
				actualizaCampo('colesterol', paciente.colesterol, funcion9);
			}else{
				funcion9();
			}
		}

		var funcion11 = function(){
			if(paciente.hipertension != undefined && patient[0].hipertension != paciente.hipertension){
				actualizaCampo('hipertension', paciente.hipertension, funcion10);
			}else{
				funcion10();
			}
		}


		var funcion12 = function(){
			if(paciente.hipotension != undefined && patient[0].hipotension != paciente.hipotension){
				actualizaCampo('hipotension', paciente.hipotension, funcion11);
			}else{
				funcion11();
			}
		}

		var funcion13 = function(){
			if(paciente.pesohabitual != undefined && patient[0].pesohabitual != paciente.pesohabitual){
				actualizaCampo('pesohabitual', paciente.pesohabitual, funcion12);
			}else{
				funcion12();
			}
		}

		var funcion14 = function(){
			if(paciente.No_gusta != undefined && patient[0].No_gusta != paciente.No_gusta){
				actualizaCampo('No_gusta', paciente.No_gusta, funcion13);
			}else{
				funcion13();
			}
		}

		var funcion15 = function(){
			if(paciente.sexo != undefined && patient[0].sexo != paciente.sexo){
				actualizaCampo('sexo', paciente.sexo, funcion14);
			}else{
				funcion14();
			}
		}

		var funcion16 = function(){
			if(paciente.lug_nacimiento != undefined && patient[0].lug_nacimiento != paciente.lug_nacimiento){
				actualizaCampo('lug_nacimiento', paciente.lug_nacimiento, funcion15);
			}else{
				funcion15();
			}
		}

		var funcion17 = function(){
			if(paciente.domicilio != undefined && patient[0].domicilio != paciente.domicilio){
				actualizaCampo('domicilio', paciente.domicilio, funcion16);
			}else{
				funcion16();
			}
		}

		var funcion18 = function(){
			if(paciente.telefono != undefined && patient[0].telefono != paciente.telefono){
				actualizaCampo('telefono', paciente.telefono, funcion17);
			}else{
				funcion17();
			}
		}

		var funcion19 = function(){
			if(paciente.patologia != undefined && patient[0].patologia != paciente.patologia){
				actualizaCampo('patologia', paciente.patologia, funcion18);
			}else{
				funcion18();
			}
		}

		var funcion20 = function(){
			if(paciente.alergia != undefined && patient[0].alergia != paciente.alergia){
				actualizaCampo('alergia', paciente.alergia, funcion19);
			}else{
				funcion19();
			}
		}

		var funcion21 = function(){
			if(paciente.tomando_medica != undefined && patient[0].tomando_medica != paciente.tomando_medica){
				actualizaCampo('tomando_medica', paciente.tomando_medica, funcion20);
			}else{
				funcion20();
			}
		}

		var funcion22 = function(){
			if(paciente.tratamiento != undefined && patient[0].tratamiento != paciente.tratamiento){
				actualizaCampo('tratamiento', paciente.tratamiento, funcion21);
			}else{
				funcion21();
			}
		}

		var funcion23 = function(){
			if(paciente.meta != undefined && patient[0].meta != paciente.meta){
				actualizaCampo('meta', paciente.meta, funcion22);
			}else{
				funcion22();
			}
		}

		var funcion24 = function(){
			if(paciente.email != undefined && patient[0].email != paciente.email){
				actualizaCampo('email', paciente.email, funcion23);
			}else{
				funcion23();
			}
		}

		var funcion25 = function(){
			if(paciente.PIN != undefined && patient[0].PIN != paciente.PIN){
				actualizaCampo('PIN', paciente.PIN, funcion24);
			}else{
				funcion24();
			}
		}

		funcion25();
	});
}*/