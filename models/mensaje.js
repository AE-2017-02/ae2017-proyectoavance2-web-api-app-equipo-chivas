var mongoose = require('mongoose');

var mensajeSchema = {
        titulo: { type: String, required:true },
        cuerpo: { type: String },
        to: { type: mongoose.Schema.Types.ObjectId, required:true }
};

module.exports = new mongoose.Schema(mensajeSchema);
module.exports.mensajeSchema = mensajeSchema;
