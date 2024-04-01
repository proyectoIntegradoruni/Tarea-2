
import UsuarioT from './Modelo/usuario.js';
// Importa multer
import Mensaje from "./Modelo/conversacion.js"
import dotenv from 'dotenv';
dotenv.config();

import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1.js';
import IamAuthenticator from 'ibm-watson/auth/index.js';
import fs from 'fs';


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

  const categ = (req, res) => {
    const categorias = obtenerCategorias();
    res.json(categorias);
  }

  const palab = (req, res) => {
    const categoria = req.query.categoria;
    
  
    const palabraAleatoria = elegirPalabraAleatoria(categoria);
    res.json(palabraAleatoria);
  }
  const ia = (req, res) => {

 
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
  }
 export { obtenerMensajes, agregarMensaje, registrarUsuario, autenticar, categ, palab, ia}