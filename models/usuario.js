var mongoose = require('mongoose');

var usuarioSchema = {
        username: { type: String, required:true },
        password: { type: String, required:true }       
};

module.exports = new mongoose.Schema(usuarioSchema);
module.exports.usuarioSchema = usuarioSchema;