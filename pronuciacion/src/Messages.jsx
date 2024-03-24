import React from "react";
import Message from "./Mesage";
const Messages = ({ messages }) => {
  
  

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
};

export default Messages;
