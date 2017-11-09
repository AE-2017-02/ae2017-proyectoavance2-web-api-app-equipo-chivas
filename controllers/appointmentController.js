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

module.exports.getAppointmentsUsedForDate = function (req, res, Cita){
	try{
		var date = req.params.date;
	} catch(e){
		return res.status(status.BAD_REQUEST).json({error: "No appointment id provided"});
	}
	
	Cita.find({ $and: [{'fecha': { $gte : new Date(date+"T00:00:00") }}, {'fecha':{$lte: new Date(date+"T23:59:59")}}]}, function(error, result){
		
		if(error){
			return res.status(status.INTERNAL_SERVER_ERROR).json({error: err.toString()});
		}
		if(!result){
			return res.status(status.NOT_FOUND).json({error: 'Not found'});
		}
		
		var finalresult = [];

		for(var i =0; i<Object.keys(result).length; i++){
			var count = 0;
			for(var j=0; j<Object.keys(result).length; j++){
				if(result[i].fecha.getTime() === result[j].fecha.getTime()){
					count ++;
				}
			}
			if(!(count > 2)){
				finalresult.push(result[i].fecha);
			}
		}
		
		var uniqueArray = finalresult
		.map(function (date) { return date.getTime() })
		.filter(function (date, i, array) {
			return array.indexOf(date) === i;
		})
		.map(function (time) { return new Date(time); });
		
		res.status(status.OK).json({appointment : uniqueArray});
		
	});
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