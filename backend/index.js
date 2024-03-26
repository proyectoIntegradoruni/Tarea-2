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

const saludos_y_presentaciones = [
  "Hello", "Good morning", "Good afternoon", "Good evening", "How are you?",
  "What's up?", "Nice to meet you", "Pleased to meet you", "Hi, what's your name?", "Where are you from?",
  "What do you do?", "How old are you?", "Goodbye",  "See you later", "See you soon",
  "Bye, have a good day", "Goodbye, take care", "How's it going?", "How was your day?", "Any news?",
  "How's work?", "How was work?", "What are your plans for today?", "Shall we grab a coffee?", "Can we talk for a moment?",
  "Can you help me, please?", "Excuse me", "I'm sorry", "Thank you", "Please"
]

const viajes_y_transportacion = [
  "Airport", "Plane", "Ticket", "Bus", "Train",
  "Taxi", "Hotel", "Check-in", "Check-out", "Reservation", "Suitcase",
  "Luggage", "Terminal", "Boarding gate", "Departure", "Arrival",
  "Passport", "Visa", "Immigration", "Customs", "Car rental",
  "Train station", "Bus station", "Subway station", "Directions", "Map",
  "Tourism", "Tour guide", "Attractions", "Excursion"
]

const comida_y_restaurantes = [
  "Menu", "Menu card", "Starter", "Main course", "Dessert",
  "Drink", "Water", "Wine", "Beer", "Coffee",
  "Tea", "Breakfast", "Lunch", "Dinner", "Appetizer",
  "Tapas", "Salad", "Soup", "Pasta",
  "Rice", "Meat", "Fish", "Chicken", "Vegetables",
  "Fruits", "Bread", "Cheese", "Dessert", "Ice cream"
]

const familia_y_mascotas = [
  "Father", "Mother", "Brother", "Sister", "Nephew",
  "Grandfather", "Grandmother", "Uncle", "Aunt", "Cousin",
  "Niece", "Boy", "Girl", "Baby", "Husband",
  "Wife", "Boyfriend", "Girlfriend", "Son", "Daughter",
  "Pet", "Dog", "Cat", "Bird", "Fish",
  "Rabbit", "Hamster", "Turtle"
]


// Función para elegir una palabra aleatoria de una categoría específica
function elegirPalabraAleatoria(categoria) {
  switch (categoria) {
    case "saludos":
      return saludos_y_presentaciones[Math.floor(Math.random() * saludos_y_presentaciones.length)];
    case "viajes":
      return viajes_y_transportacion[Math.floor(Math.random() * viajes_y_transportacion.length)];
    case "gastronomia":
      return comida_y_restaurantes[Math.floor(Math.random() * comida_y_restaurantes.length)];
    case "familia":
      return familia_y_mascotas[Math.floor(Math.random() * familia_y_mascotas.length)];
    default:
      return "Categoría no válida";
  }
}






// Ruta para obtener las categorías

app.get('/categorias', (req, res) => {
  const categorias = obtenerCategorias();
  res.json(categorias);
});
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor backend!');
});
app.post('/login', autenticar);
;
app.post('/registro', registrarUsuario);

app.get('/palabra', (req, res) => {
  const categoria = req.query.categoria;
  

  const palabraAleatoria = elegirPalabraAleatoria(categoria);
  res.json(palabraAleatoria);
});
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  })