import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({
    email: String,
    nombre:String,
    password: String
    
});


const UsuarioT = mongoose.model("Usuarios_T", usuarioSchema);


export default UsuarioT;