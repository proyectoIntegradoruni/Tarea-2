import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
        alert(data); 
      } else {
        
        alert(data);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Ocurrió un error al registrar. Por favor, intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form" onSubmit={handleRegistro}>
            <span className="login-form-title"> Registro </span>

            <span className="login-form-title">
              <img src={"https://cdn-icons-png.flaticon.com/512/3898/3898068.png"} alt="Jovem Programador" />
            </span>

            <div className="wrap-input">
              <input
                className={nombre !== "" ? "has-val input" : "input"}
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
              />
            </div>

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
              <button className="login-form-btn" type="submit">Registro</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registro;
