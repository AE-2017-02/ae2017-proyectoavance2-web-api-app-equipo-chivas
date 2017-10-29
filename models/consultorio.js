var mongoose = require('mongoose');

var consultorioSchema = {
        nombre: { type: String, required:true },
        logo: { type: String },
        direccion: { type: String, required:true },
        telefono: { type: String },
};

module.exports = new mongoose.Schema(consultorioSchema);
module.exports.consultorioSchema = consultorioSchema;