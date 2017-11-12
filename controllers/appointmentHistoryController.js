var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getAppointmentHistorys = function (req, res, HistorialCitas){
	HistorialCitas.find({}).exec(handle.handleMany.bind(null, 'historialCitas', res));
};

module.exports.getAppointmentHistory = function (req, res, HistorialCitas){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No historialCita id provided"});
	}
	HistorialCitas.find({'_id': _id}).exec(handle.handleOne.bind(null, 'historialCita', res));
};

module.exports.newAppointmentHistory = function (req, res, HistorialCitas){
	try{
		var historialCita = req.body.historial_citas;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No historialCita provided"});
	}
	HistorialCitas.create(historialCita, handle.handleMany.bind(null, 'historialCita', res));
};

module.exports.deleteAppointmentHistory = function (req, res, HistorialCitas){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	HistorialCitas.remove({'_id': _id}, handle.handleOne.bind(null, 'historialCita', res));
};

module.exports.updateAppointmentHistory = function(req, res, HistorialCitas){
	try{
		var idHistorialCita = req.params._id;
		var historial_citas = req.body.historial_citas;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		HistorialCitas.update({_id: idHistorialCita}, query, function(err, resu){
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

	HistorialCitas.find({_id: idHistorialCita}, function(err, historialCitas){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!historialCitas){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(historial_citas) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(historial_citas.pacientes != undefined && historialCitas[0].pacientes != historial_citas.pacientes){
				actualizaCampo('pacientes', historial_citas.pacientes, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		var funcion2 = function(){
			if(historial_citas.idRegistroCitas != undefined && historialCitas[0].idRegistroCitas != historial_citas.idRegistroCitas){
				actualizaCampo('idRegistroCitas', historial_citas.idRegistroCitas, funcion1);
			}else{
				funcion1();
			}
		}	

		funcion2();
	});
}