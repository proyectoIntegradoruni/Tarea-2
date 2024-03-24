import React from "react";
const Message = ({ content, timestamp, isOwner }) => {
    const ownerImageUrl = "https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg";
    const nonOwnerImageUrl = "https://cdn-icons-png.flaticon.com/512/3898/3898068.png";
  
    // Selecciona la URL de la imagen basada en el estado de isOwner
    const imageUrl = isOwner ? ownerImageUrl : nonOwnerImageUrl;

  


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
    </div>
  );
};

export default Message;
