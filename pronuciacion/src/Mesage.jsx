import React, {useState } from "react";
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useSpeechSynthesis } from 'react-speech-kit';

const Message = ({ content, timestamp, isOwner,reproduccion,text}) => {
    const ownerImageUrl = "https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg";
    const nonOwnerImageUrl = "https://cdn-icons-png.flaticon.com/512/3898/3898068.png";
     const[palabra, setPalabra] =  useState("");
     const { speak } = useSpeechSynthesis();
     

    // Selecciona la URL de la imagen basada en el estado de isOwner
    const imageUrl = isOwner ? ownerImageUrl : nonOwnerImageUrl;

  
    const reproducirPronunciacion = () => {
      setPalabra(text)
      if (palabra) {
        console.log(true)
        speak({ text: palabra });
      }
    };

  return (
    <div className={`message ${isOwner ? "owner" : ""}`}>
      <div className="messageInfo">
        <img
          src={imageUrl}
          alt=""
        />
        {/*<span>{timestamp}</span>*/}
      </div>

      <div className="messageContent">
        <p>{content}</p>
      </div>
      {/* Mostrar el botón solo si reproduccion es true */}
      {reproduccion && (
        <button onClick={reproducirPronunciacion}>Reproducir Pronunciación</button>
      )}
    </div>
      
   
  );
};

export default Message;
