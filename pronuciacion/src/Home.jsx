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

 
  useEffect(() => {
    // Agregar mensaje de bienvenida con opciones cuando el componente se monta
    const welcomeMessage = {
      content: "¡Hola! . ¿Quieres practicar tu pronunciación?",
      timestamp: new Date().toISOString(),
      isOwner: false // El mensaje es del asistente, no del usuario
    };
    setMensajes([welcomeMessage]);
  }, []);

  // Función para manejar la respuesta del usuario
  const handleUserResponse = (response) => {
    const newMessage = {
      content: response,
      timestamp: new Date().toISOString(),
      isOwner: true // El mensaje es del usuario
    };
    setMensajes(prevMessages => [...prevMessages, newMessage]);
    // Aquí puedes agregar la lógica para responder al mensaje del usuario según su respuesta
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
          <Input asesor={"Juridico"} onResponse={handleUserResponse} />
        </div>
      </div>
    </div>
  );
}

export default Home;

