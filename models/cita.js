var mongoose = require('mongoose');

var citaSchema = {
        fecha:{type:Date, required:true},
		estatus: {type: String, required: true, enum: ['Pendiente', 'Atendida', 'Cancelada'], default:'Pendiente'}
};

module.exports = new mongoose.Schema(citaSchema);
module.exports.citaSchema = citaSchema;