/*import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import jpIMG from "./assets/react.svg";

import "./styles.css";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Importa useNavigate y úsalo para la navegación

  const handleregistro = async (e) => {
    e.preventDefault();

    navigate('/registro'); // Utiliza navigate para redirigir al usuario a la página de registro
    console.log("autenticado");
  };


  


  return (


            <span className="login-form-title">
              <img src={"https://cdn-icons-png.flaticon.com/512/3898/3898068.png"} alt="Jovem Programador" />
            </span>

           
  );
}

export default Home;*/

import React, { useEffect, useState } from 'react';
import Input from "./input";
import Messages from "./Messages";
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';

function Home() {
  const [escri, setEscri] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");

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
  }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez al montar el componente


  useEffect(() => {
    // Agregar mensaje de bienvenida con opciones cuando el componente se monta
    const welcomeMessage = {
      content: "¡Hola ${nombreUsuario}¡, quieres practicar? ¿Qué categoría deseas seleccionar?",
      timestamp: new Date().toISOString(),
      isOwner: false // El mensaje es del asistente, no del usuario
    };
    setMensajes([welcomeMessage]);
  }, []);

  // Función para manejar la respuesta del usuario
  const handleUserResponse = (response) => {
    const newMessage = {
      content: `Seleccionaste la categoría: ${response}`,
      timestamp: new Date().toISOString(),
      isOwner: true // El mensaje es del usuario
    };
    setMensajes(prevMessages => [...prevMessages, newMessage]);
    setCategorias([]);    // Aquí puedes agregar la lógica para responder al mensaje del usuario según su respuesta
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
        </div>
      </div>
    </div>
  );
}

export default Home;
