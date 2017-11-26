var mongoose = require('mongoose');

var historial_citasSchema = {
        paciente: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Paciente" },
	    idRegistroCitas: [
		{type: mongoose.Schema.Types.ObjectId, required: true, ref: "RegistroCita" }
	]  
        
};

module.exports = new mongoose.Schema(historial_citasSchema);
module.exports.historial_citasSchema = historial_citasSchema;
