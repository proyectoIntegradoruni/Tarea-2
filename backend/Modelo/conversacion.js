const mongoose = require('mongoose');

const mensajeSchema = mongoose.Schema({
    remitente: {
        type: String,
        required: true,
        trim: true // Elimina espacios en blanco al principio y al final
    },
    destinatario: {
        type: String,
        required: true,
        trim: true
    },
    contenido: {
        type: String,
        required: true,
        trim: true
    },
    reproduccion: {
        type: Boolean,
        required: true,
      
    }
});
 Mensaje1 = mongoose.model("Mensaje2", mensajeSchema);


module.exports =  Mensaje1;