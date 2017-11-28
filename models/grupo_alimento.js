var mongoose = require('mongoose');

var grupoAlimentoSchema = {
    nombre: { type: String, required:true },
    energia: { type: number },
    proteina: { type: number},
    lipidos: { type: number },
    carbohidratos: {type:number}
};

module.exports = new mongoose.Schema(grupoAlimentoSchema);
module.exports.grupoAlimentoSchema = grupoAlimentoSchema;