var status = require('http-status');
var handle = require('./../utils/handle');
var _ = require('underscore');

module.exports.getAppointments = function (req, res, Cita){
	Cita.find({}).exec(handle.handleMany.bind(null, 'appointments', res));
};

module.exports.getAppointment = function (req, res, Cita){
	try{
		var _id = req.params._id;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No appointment id provided"});
	}
	Cita.find({'_id': _id}).exec(handle.handleOne.bind(null, 'appointment', res));
};

module.exports.newAppointment = function (req, res, Cita){
	try{
		var appointment = req.body.appointment;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No appointment provided"});
	}
	Cita.create(appointment, handle.handleMany.bind(null, 'appointment', res));
};

module.exports.deleteAppointment = function (req, res, Cita){
	try{
		var _id = req.params._id;
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()});
	}
	Cita.remove({'_id': _id}, handle.handleOne.bind(null, 'appointment', res));
};

module.exports.updateAppointment = function(req, res, Cita){
	try{
		var idCita = req.params._id;
		var cita = req.body.paciente;
		var count = 0;
		var camposActualizados = "";
	}catch(e){
		return res.status(status.BAD_REQUEST).json({error: e.toString()})
	}

	var actualizaCampo = function(campo, valor, funcion){
		var query = {'$set':{}};
		query['$set'][campo] = valor;
		Cita.update({_id: idCita}, query, function(err, resu){
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

	Cita.find({_id: idCita}, function(err, appointment){

		if(err){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}

		if(!appointment){
			return res.status(status.NOT_FOUND).json({error : 'Not found'});
		}

		var funcionfinal = function(){
			if(_.isEmpty(cita) || count == 0){
				return res.status(status.BAD_REQUEST).json({error: 'Not actualizable fields'});
			}

			res.status(status.OK).json({mensaje : camposActualizados});
		}

		var funcion1 = function(){
			if(cita.fecha != undefined && appointment[0].fecha != cita.fecha){
				actualizaCampo('fecha', cita.fecha, funcionfinal);
			}else{
				funcionfinal();
			}
		}

		funcion1();
	});
}