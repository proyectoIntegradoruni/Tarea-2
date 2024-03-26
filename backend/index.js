const express = require('express');
const  conectarDB = require('./conexion');
const bodyParser = require('body-parser');
const Usuario = require("./Modelo/usuario");

const app = express();
const cors = require("cors");
const UsuarioT = require('./Modelo/usuario');

conectarDB();

app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

function obtenerCategorias() {

  const categorias = ["saludos", "viajes", "gastronomia", "familia", "No quiero practicar"];

  return categorias;
}
const autenticar = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await UsuarioT.findOne({ email });

    if (!usuario) {
      return res.status(401).json('Credenciales inválidas');
    }

    if (usuario.password === password) {
      // Si las credenciales son correctas, puedes devolver el usuario autenticado
      res.status(200).json(usuario);
    } else {
      return res.status(400).json('Contraseña incorrecta');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Error interno del servidor');
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
// Ruta para obtener las categorías

app.get('/categorias', (req, res) => {
  const categorias = obtenerCategorias();
  res.json(categorias);
});
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor backend!');
});
app.post('/login', autenticar);
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  });
app.post('/registro', registrarUsuario);