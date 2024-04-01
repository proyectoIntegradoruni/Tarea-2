const express = require('express');
const app = express();
const cors = require("cors");
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}
app.options("", cors(corsConfig));
app.use(cors(corsConfig));

const  conectarDB = require('./conexion');
const bodyParser = require('body-parser');

const multer = require('multer'); // Importa multer


const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const {obtenerMensajes, agregarMensaje, registrarUsuario, autenticar} = require("./function")


conectarDB();
const fs = require('fs');
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

function obtenerCategorias() {

  const categorias = ["saludos", "viajes", "gastronomia", "familia", "No quiero practicar"];

  return categorias;
}


const saludos_y_presentaciones = [
  "Hello", "Good morning", "Good afternoon", "Good evening", "How are you",
  "What's up", "Nice to meet you", "Pleased to meet you", "Hi, what's your name", "Where are you from",
  "What do you do", "How old are you", "Goodbye",  "See you later", "See you soon",
  "Bye, have a good day", "Goodbye, take care", "How's it going?", "How was your day", "Any news",
  "How's work?", "How was work", "What are your plans for today", "Shall we grab a coffee", "Can we talk for a moment",
  "Can you help me, please", "Excuse me", "I'm sorry", "Thank you", "Please"
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



const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.webm'); // Agregar .webm al final del nombre del archivo
  }
});
const upload = multer({ storage: storage });

// Middleware para manejar la carga de archivos de audio
app.post('/audio', upload.single('audio'), (req, res) => {

 
  const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
      apikey: "AjUoSfSaQ5W-4gerstpxHvCD0empCdSe-d65jCUZDjGF",
    }),
    serviceUrl: "https://api.au-syd.speech-to-text.watson.cloud.ibm.com/instances/79307fc3-6bde-4beb-ad02-a2906d2f3766",
    disableSslVerification: true,
  }); 
  
  
  // Verificar si se proporcionó un archivo de audio
 if (!req.file) {
    return res.status(400).json({ mensaje: 'No se ha proporcionado ningún archivo de audio' });
  }

 
   const contentType = req.file.mimetype;
  const transferencia = fs.createReadStream(req.file.path);
  // Configurar los parámetros para enviar el audio a Watson Speech to Text
  const params = {
    audio: transferencia, // Pasar el contenido del archivo como un búfer
    contentType: 'audio/webm',
  };

  // Enviar el audio a Watson Speech to Text y obtener la transcripción
  speechToText.recognize(params)
    .then(response => {
      // Obtener la transcripción del audio
      const transcripcion = response.result.results[0].alternatives[0].transcript;
      
      // Enviar la transcripción como respuesta al cliente
      console.log("bien la trascripcion")
      res.status(200).json({ transcripcion });
    })
    .catch(error => {
      // Manejar cualquier error que ocurra durante la conversión de audio a texto
      console.error('Error al convertir audio en texto:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }); 
})

app.post('/mensaje', agregarMensaje);
app.post('/historial',obtenerMensajes);



  
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  })