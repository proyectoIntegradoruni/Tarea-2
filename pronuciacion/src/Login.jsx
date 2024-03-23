import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import jpIMG from "./assets/react.svg";

import "./styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Importa useNavigate y úsalo para la navegación

  const handleregistro = async (e) => {
    e.preventDefault();

    navigate('/registro'); // Utiliza navigate para redirigir al usuario a la página de registro
    console.log("autenticado");
  };

  const handleregistro2 = async (e) => {
    e.preventDefault();

    navigate('/home'); // Utiliza navigate para redirigir al usuario a la página de registro
    console.log("autenticado");
  };


  


  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form">
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
              />
              <span className="focus-input" data-placeholder="Email"></span>
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="Password"></span>
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn" onClick={handleregistro2}>Login</button>
            </div>

            <div className="text-center">
              <span className="txt1">No tienes cuenta? </span>
              <a className="txt2" href="#" onClick={handleregistro}>
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
