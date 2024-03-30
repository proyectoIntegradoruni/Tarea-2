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

    // Verificar si content es una cadena de texto o un archivo de audio codificado en Base64
    const isAudio = typeof content === 'string' && content.startsWith('data:audio/');

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
      {isAudio ? (
        // Si es un archivo de audio, renderizar un elemento <audio> con la fuente codificada en Base64
        <audio controls>
          <source src={content} type="audio/mp3" />
          Tu navegador no soporta la reproducción de audio.
        </audio>
      ) : (
        // Si es una cadena de texto, renderizar un elemento <p> con el contenido de texto
        <p>{content}</p>
      )}
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