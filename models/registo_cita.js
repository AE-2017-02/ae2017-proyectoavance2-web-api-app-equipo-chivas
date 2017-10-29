var mongoose = require('mongoose');

var registro_citaSchema = {
        idCita: { type: Schema.Types.ObjectId, required:true },
        peso: { type: Number, required:true },
        tipo: { type: Number, required:true },
        mediciones: {
        cirfunferencias:{
            brazo:{type:Number, required:true},
            cintura:{type:Number, required:true},
            cadera:{type:Number, required:true},
            brazo_cont:{type:Number, required:true},
            muslo:{type:Number, required:true},
            pantorrilla:{type:Number, required:true}
        },
        pliegues:{
            tricipital:{type:Number,required:true},
            sEscapulada:{type:Number,required:true},
            bicapital:{type:Number, required:true},
            seliaco:{type:Number, required:true},
            sespinaje:{type:Number, required:true},
            abdominal:{type:Number, required:true},
            muslo:{type:Number, required:true},
            pantorrilla:{type:Number, required:true}

        }}      
        
};

module.exports = new mongoose.Schema(registro_citaSchema);
module.exports.registro_citaSchema = registro_citaSchema;