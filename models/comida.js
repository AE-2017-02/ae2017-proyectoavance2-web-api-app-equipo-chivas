var mongoose = require('mongoose');

var comidaSchema = {
        nombre: { type: String, required:true },
        ingred: [{ idIngred: { type: Schema.Types.ObjectId, required:true },
                   cant: { type: Number, required:true }           
        }]           
};

module.exports = new mongoose.Schema(comidaSchema);
module.exports.comidaSchema = comidaSchema;