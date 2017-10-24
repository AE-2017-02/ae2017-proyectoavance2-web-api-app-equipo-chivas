var mongoose = require('mongoose');

var menu_usuarioSchema = {
    desayuno : {
        idMenu: { type: String, required:true },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }       
    },
    comida: {
        idMenu: { type: String, required:true },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true}
    },
    cena: {
        idMenu: { type: String, required:true },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }
    },
    colacion1: {
        idMenu: { type: String, required:true },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }
    },
    colacion2: {
        idMenu: { type: String, required:true },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }
    }
};

module.exports = new mongoose.Schema(menu_usuarioSchema);
module.exports.menu_usuarioSchema = menu_usuarioSchema;