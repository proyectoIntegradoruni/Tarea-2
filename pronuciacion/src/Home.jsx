import React, { useEffect, useState } from 'react';
import Input, { pp } from "./input";
import Messages from "./Messages";
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useSpeechSynthesis } from 'react-speech-kit';


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
 console.log(pp)
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

  // Función para manejar la respuesta del usuario
  const handleUserResponse = async (response) => {
    setCategorias([]);
    try {
      // Realizar la petición al servidor con la categoría seleccionada
      const fetchResponse = await fetch(`http://localhost:3001/palabra?categoria=${response}`);
      if (!fetchResponse.ok) {
        throw new Error('Error al obtener la palabra aleatoria');
      }
      const data = await fetchResponse.json();
      setPalabra(data);
  
      const newMessageUser = {
        content: `Seleccionaste la categoría: ${response}`,
        timestamp: new Date().toISOString(),
        isOwner: true,
        reproduccion: false,
        text: data
      };
  
      const newMessageAsistente = {
        content: data,
        timestamp: new Date().toISOString(),
        isOwner: false,
        reproduccion: true,
        text: data
      };
  
      setMensajes(prevMessages => [...prevMessages, newMessageUser, newMessageAsistente]);
      // speak({ text: data });  Convertir el texto de la palabra aleatoria a voz y reproducirlo
    } catch (error) {
      console.error('Error:', error);
      // Manejar el error según sea necesario
    }
  };
  

  const reproducirPronunciacion = () => {
    if (palabra) {
      speak({ text: palabra });
    }
  };
  
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
          
          <Messages messages={mensajes} />
          {escri && <TypingIndicator content="asesor escribiendo..." />}
          <div className="categorias">
            {categorias.map((categoria, index) => (
              <button  className="login-form-btn2"   key={index} onClick={() => handleUserResponse(categoria)}>{categoria}</button>
            ))}
          </div>
          <Input asesor={"Juridico"} onResponse={handleUserResponse} />
          <p>la palabra es: {pp}</p>
          
        </div>
       {/* <button onClick={reproducirPronunciacion}>Reproducir Pronunciación</button>*/}
      </div>
    </div>
  );
}

export default Home;
