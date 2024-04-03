import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


import "./styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://tarea-2.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('nombreUsuario', data.nombreUsuario); // Corregido aquí
        localStorage.setItem('reiniciocategorias',false);
        // Crear mensaje de bienvenida usando el nombre de usuario obtenido del servidor
        
  
        // Enviar mensaje de bienvenida al servidor
        const newMessageUser1 = {
          remitente: "Pronunciacion", // El remitente es "Pronunciacion" porque es el sistema de pronunciación
          destinatario: data.nombreUsuario, // El destinatario es el usuario actual
          contenido: `¡Hola ${data.nombreUsuario}!, ¿quieres practicar? ¿Qué categoría deseas seleccionar? en la parte de abajo encontraras las categorias disponibles`,
          reproduccion: false // No se reproduce este mensaje
        };
  
        // Realizar la petición al servidor para enviar el nuevo mensaje
        const fetchResponse1 = await fetch('https://tarea-2.onrender.com/mensaje', {
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
  
        navigate('/home');
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo más tarde.');
    }
  };
  

  const handleRegistro = (e) => {
    e.preventDefault();
    navigate('/registro');
  };

  return (
    <div className="container">
      <div className="container-login">
      <div className="izq-login">
        <img className="imagen-p" src={"https://i.pinimg.com/736x/03/4f/9b/034f9bfbf57e9b41b80cf10c19bdded9.jpg"} alt="Jovem Programador" />
        
        
        <div className="wrap-login">
          <form className="login-form" onSubmit={handleLogin}>
            <span className="login-form-titl"> Bienvenidos </span>

            <span className="login-form-title">
              <img src={"https://cdn-icons-png.flaticon.com/512/3898/3898068.png"} alt="Jovem Programador" />
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
                style={{ color: email !== "" ? "black" : "black" }}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                style={{ color: password !== "" ? "black" : "black" }}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn" type="submit">Login</button>
            </div>

            <div className="text-center">
              <span className="txt1">No tienes cuenta? </span>
              <a className="txt2" href="#" onClick={handleRegistro}>
               Crear cuenta
              </a>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
