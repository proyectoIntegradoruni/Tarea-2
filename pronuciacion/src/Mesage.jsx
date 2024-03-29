import React, {useState } from "react";
import { TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'

const Message = ({ content, isOwner,reproduccion}) => {
    const ownerImageUrl = "https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg";
    const nonOwnerImageUrl = "https://cdn-icons-png.flaticon.com/512/3898/3898068.png";
    const[palabra, setPalabra] =  useState("");
    const { speak } = useSpeechSynthesis();


    const imageUrl = isOwner ? ownerImageUrl : nonOwnerImageUrl;

  
    const reproducirPronunciacion = () => {
      setPalabra(content)
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
        <FontAwesomeIcon 
        icon={faVolumeUp} 
        onClick={reproducirPronunciacion} 
        style={{ cursor: 'pointer', fontSize: '2em' }} 
      />
       
      )}
    </div>
      
   
  );
};

export default Message;
{ /*<button  className="login-form-btn2"  onClick={reproducirPronunciacion}>Reproducir Pronunciación</button>*/}