import { useState } from "react";

import jpIMG from "./assets/react.svg";

import "./styles.css";

function App2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    

            <span className="login-form-title">
              <img src={"https://cdn-icons-png.flaticon.com/512/3898/3898068.png"} alt="Jovem Programador" />
            </span>

    
  
  );
}

export default App2;