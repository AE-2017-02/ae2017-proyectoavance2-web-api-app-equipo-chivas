var mongoose = require('mongoose');

var mensajeSchema = {
        titulo: { type: String, required:true },
        cuerpo: { type: String },
        to: [{
              _idUser:  { type: mongoose.Schema.Types.ObjectId, required:true }, 
              deviceToken: {type: String, required: true}
        }]
};

module.exports = new mongoose.Schema(mensajeSchema);
module.exports.mensajeSchema = mensajeSchema;
