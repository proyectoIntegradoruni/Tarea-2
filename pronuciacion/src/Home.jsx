import React, { useEffect, useState } from 'react';
import Input, { pp } from "./input";
import Messages from "./Messages";
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import axios from 'axios';

function Home() {
  const [escri, setEscri] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const { speak } = useSpeechSynthesis(); 
  const[palabra, setPalabra] =  useState("");
  
  useEffect(() => {
    // Recuperar el nombre de usuario del almacenamiento local
    const nombre = localStorage.getItem('nombreUsuario');
    if (nombre) {
      setNombreUsuario(nombre);
    }
  }, []);

  useEffect(() => {
    // Función para obtener las categorías desde el servidor
    const obtenerCategoriasDesdeServidor = async () => {
      try {
        const response = await fetch('http://localhost:3001/categorias');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Llamar a la función para obtener las categorías al montar el componente
    obtenerCategoriasDesdeServidor();
  }, []);

  useEffect(() => {
    // Agregar mensaje de bienvenida con opciones cuando el componente se monta
    const welcomeMessage = {
      content: `¡Hola ${nombreUsuario}!, ¿quieres practicar? ¿Qué categoría deseas seleccionar?`,
      timestamp: new Date().toISOString(),
      isOwner: false, // El mensaje es del asistente, no del usuario
      reproduccion: false,
      text: palabra      
    };
    setMensajes([welcomeMessage]);
  }, [nombreUsuario]);

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const remitente = nombreUsuario;
        const destinatario = 'Pronunciacion';
        const url = 'http://localhost:3001/historial';

        // Cambia esta línea a axios.get si es una solicitud GET
        const response = await axios.post(url, { remitente, destinatario });
        const mensajesObtenidos = response.data.mensajes;

        setMensajes(mensajesObtenidos);
        console.log('Mensajes obtenidos:', mensajesObtenidos);
      } catch (error) {
        console.error('Error al obtener los mensajes:', error);
      }
    };

    // Solo ejecutar obtenerMensajes si hay mensajes en el estado (es decir, el mensaje de bienvenida ya se ha establecido)
    if (mensajes.length > 0) {
      const intervalId = setInterval(() => {
        obtenerMensajes();
      }, 2000);

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    }
  }, [mensajes]);



 

  // Función para manejar la respuesta del usuario
  const handleUserResponse = async (response) => {
    setCategorias([]);
  
    try {
      // Realizar la petición al servidor para obtener una palabra aleatoria de la categoría seleccionada
      const fetchResponse = await fetch(`http://localhost:3001/palabra?categoria=${response}`);
      
      // Verificar si la respuesta es exitosa
      if (!fetchResponse.ok) {
        throw new Error('Error al obtener la palabra aleatoria');
      }
  
      const data = await fetchResponse.json();
      setPalabra(data);
      console.log(palabra)
      
      // Crear un nuevo mensaje del usuario para indicar la categoría seleccionada
      const newMessageUser1 = {
        remitente:`${nombreUsuario}` , // El remitente es "Pronunciacion" porque es el sistema de pronunciación
        destinatario:  "Pronunciacion", // El destinatario es el usuario actual
        contenido: `Seleccionaste la categoría: ${response}`,
        reproduccion: false // No se reproduce este mensaje
      };
      
      // Realizar la petición al servidor para enviar el nuevo mensaje
      const fetchResponse1 = await fetch('http://localhost:3001/mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessageUser1)
      });
  
      // Verificar si la primera solicitud fue exitosa
      if (!fetchResponse1.ok) {
        throw new Error('Error al enviar el mensaje 1');
      }
  
      // Crear un nuevo mensaje del usuario para reproducir la palabra
      const newMessageUser2 = {
        remitente: "Pronunciacion", // El remitente es el usuario actual
        destinatario: `${nombreUsuario}`, // El destinatario es el sistema de pronunciación
        contenido: `${data}`, // El contenido es la palabra seleccionada
        reproduccion: true // Se reproduce este mensaje
      };
  
      // Realizar la petición al servidor para enviar el nuevo mensaje
      const fetchResponse2 = await fetch('http://localhost:3001/mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessageUser2)
      });
  
      // Verificar si la segunda solicitud fue exitosa
      if (!fetchResponse2.ok) {
        throw new Error('Error al enviar el mensaje 2');
      }/**/
    } catch (error) {
      console.error('Error:', error);
      // Manejar el error según sea necesario
    }
  };
   
  const verificar = () => {
    if (palabra.toLowerCase() === pp.toLowerCase()) {
      console.log("felicitaciones")
      
    }
    else
    {
      console.log("fallaste")
     
    }
   
  };

  const messages = mensajes.map(item => ({
    
    content: item.contenido,
    isOwner: item.destinatario === 'Pronunciacion', 
    reproduccion: item.reproduccion
  }));
  const bienvenida = {
    content: `¡Hola ${nombreUsuario}!, ¿quieres practicar? ¿Qué categoría deseas seleccionar?`,
    isOwner: false,
    reproduccion: false,
  }
  
  
  return (
    <div className='home'>
      <div className="container">  
        <div className="chat">
          <div className="chatInfo">
            <span style={{fontSize: '30px' , fontFamily: 'Comic Sans MS', fontWeight: 'bold', display: 'inline-block', margin: '10'}}>Pronunciación</span>
            <div className="chatIcons">
              <img src={"https://cdn-icons-png.flaticon.com/512/3898/3898068.png"} alt="" />
            </div>
          </div>
          
          <Messages messages={messages} />
          {escri && <TypingIndicator content="asesor escribiendo..." />}
          <div className="categorias">
            {categorias.map((categoria, index) => (
              <button  className="login-form-btn2"   key={index} onClick={() => handleUserResponse(categoria)}>{categoria}</button>
            ))}
          </div>
          <Input asesor={"Juridico"} onResponse={handleUserResponse} />
          
          
        </div>
       {/* <button onClick={reproducirPronunciacion}>Reproducir Pronunciación</button>*/}
      </div>
    </div>
  );
}

export default Home;
