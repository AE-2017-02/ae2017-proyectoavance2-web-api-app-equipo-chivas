var mongoose = require('mongoose');

var grupoAlimentoSchema = {
    nombre: { type: String, required:true },
    energia: { type: Number },
    proteina: { type: Number},
    lipidos: { type: Number },
    carbohidratos: {type:Number}
};

module.exports = new mongoose.Schema(grupoAlimentoSchema);
module.exports.grupoAlimentoSchema = grupoAlimentoSchema;