var mongoose = require('mongoose');

var historial_citasSchema = {
        paciente: {type: Schema.Types.ObjectId, required: true},
	    idRegistroCitas: [
		{type: Schema.Types.ObjectId, required: true}
	]  
        
};

module.exports = new mongoose.Schema(historial_citasSchema);
module.exports.historial_citasSchema = historial_citasSchema;