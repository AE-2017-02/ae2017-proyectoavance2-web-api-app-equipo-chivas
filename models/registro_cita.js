var mongoose = require('mongoose');

var registro_citaSchema = {
        idCita: { type: mongoose.Schema.Types.ObjectId, required:true, ref:"Cita" },
        peso: { type: Number, required:true },
        talla: { type: Number, required:true },
        mediciones: {
        circunferencias:{
            brazo:{type:Number, required:true},
            cintura:{type:Number, required:true},
            cadera:{type:Number, required:true},
            brazo_cont:{type:Number, required:true},
            muslo:{type:Number, required:true},
            pantorrilla:{type:Number, required:true},
			muneca: {type:Number, required:true}
        },
        pliegues:{
            tricipital:{type:Number,required:true},
            sEscapulada:{type:Number,required:true},
            bicipital:{type:Number, required:true},
            siliaco:{type:Number, required:true},
            sespinale:{type:Number, required:true},
            abdominal:{type:Number, required:true},
            muslo:{type:Number, required:true},
            pantorrilla:{type:Number, required:true}

        }}      
        
};

module.exports = new mongoose.Schema(registro_citaSchema);
module.exports.registro_citaSchema = registro_citaSchema;