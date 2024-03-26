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
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        
        localStorage.setItem('nombreUsuario', data.nombreUsuario); // Corregido aquí
        console.log(data); // Para verificar la respuesta del servidor
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
        <div className="wrap-login">
          <form className="login-form" onSubmit={handleLogin}>
            <span className="login-form-title"> Bienvenidxs </span>

            <span className="login-form-title">
              <img src={"https://cdn-icons-png.flaticon.com/512/3898/3898068.png"} alt="Jovem Programador" />
            </span>

            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="email"
                value={email}
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
  );
}

export default Login;
