import React, { useState } from "react";
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

export default Home;
