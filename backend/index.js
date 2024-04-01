import express from "express"
import cors from 'cors';
import  conectarDB from './conexion.js';
import multer from 'multer'; // Importa multer

import {obtenerMensajes, agregarMensaje, registrarUsuario, autenticar, categ, palab, ia} from "./function.js"

const app = express();

app.use(express.json());

const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}
app.options("", cors(corsConfig));
app.use(cors(corsConfig));




conectarDB();


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