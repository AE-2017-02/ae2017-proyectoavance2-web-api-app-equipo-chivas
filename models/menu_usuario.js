var mongoose = require('mongoose');

var menu_usuarioSchema = {
    desayuno : {
        idMenu: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Menu" },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }       
    },
    comida: {
        idMenu: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Menu" },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true}
    },
    cena: {
        idMenu: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Menu" },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }
    },
    colacion1: {
        idMenu: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Menu" },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }
    },
    colacion2: {
        idMenu: { type: mongoose.Schema.Types.ObjectId, required:true , ref: "Menu" },
        hora: { type: String, required:true },
        cumplido: { type: Boolean, required:true }
    }
};

module.exports = new mongoose.Schema(menu_usuarioSchema);
module.exports.menu_usuarioSchema = menu_usuarioSchema;