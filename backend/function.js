
const UsuarioT = require('./Modelo/usuario');
// Importa multer
const Mensaje = require("./Modelo/conversacion")
require('dotenv').config();


const autenticar = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const usuario = await UsuarioT.findOne({ email });
  
      if (!usuario) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }
  
      if (usuario.password === password) {
        // Si las credenciales son correctas, puedes devolver el usuario autenticado
        const nombreUsuario = `${usuario.nombre}`;
        res.status(200).json({ nombreUsuario });
      } else {
        return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };
  
  
  const registrarUsuario = async (req, res) => {
    const { email, nombre, password } = req.body;
  
    try {
      // Verificar si ya existe un usuario con el mismo correo electrónico
      const usuarioExistente = await UsuarioT.findOne({ email });
  
      if (usuarioExistente) {
        return res.status(400).json('El correo electrónico ya está en uso');
      }
  
      // Crear un nuevo usuario utilizando el modelo UsuarioT
      const nuevoUsuario = new UsuarioT({ email, nombre, password });
      await nuevoUsuario.save();
  
      res.status(201).json('Usuario registrado exitosamente');
    } catch (error) {
      console.log(error);
      res.status(500).json('Error interno del servidor');
    }
  };
  
  const agregarMensaje = async (req, res) => {
    const {  remitente, destinatario, contenido,reproduccion} = req.body;
    const nuevoMensaje = new Mensaje({
      remitente,
      destinatario,
      contenido,reproduccion
    });
  
    try {
  
        await nuevoMensaje.validate();
  
        await nuevoMensaje.save();
    
       
        res.status(200).json({ respuesta: nuevoMensaje });
       
     
  
        return nuevoMensaje;
    } catch (error) {
        console.error('Error al agregar el mensaje:', error);
        throw error;
    }
  };
  
  
  const obtenerMensajes = async (req, res) => {
  
    const { remitente, destinatario } = req.body;
    try {
      const { remitente, destinatario } = req.body;
      const mensajes = await Mensaje.find({
        $or: [
          { remitente, destinatario },
          { remitente: destinatario, destinatario: remitente },
        ],
      })
  
      res.status(200).json({ mensajes });
  
      return mensajes;
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      res.status(500).json({ error: 'Error al obtener los mensajes' });
      throw error;
    }
  };


  module.exports = { obtenerMensajes, agregarMensaje, registrarUsuario, autenticar}