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

const {obtenerMensajes, agregarMensaje, registrarUsuario, autenticar, categ, palab, ia} = require("./function")


conectarDB();

app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3001;


// Ruta para obtener las categorías

app.get('/categorias', categ);
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor backend!');
});
app.post('/login', autenticar);
;
app.post('/registro', registrarUsuario);

app.get('/palabra', palab);

app.post('/mensaje', agregarMensaje);
app.post('/historial',obtenerMensajes);

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.webm'); // Agregar .webm al final del nombre del archivo
  }
});
const upload = multer({ storage: storage });

// Middleware para manejar la carga de archivos de audio
app.post('/audio', upload.single('audio'), ia)

  
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  })