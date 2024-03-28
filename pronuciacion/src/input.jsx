import React, { useState } from 'react';

import Img from "./img/img.png"
import Attach from "./img/attach.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

//import axios from 'axios';
const Input = ({asesor}) => {
  const [texto, setTexto] = useState('');
  const [grabando, setGrabando] = useState(false); // Estado para indicar si se está grabando o no


  const handleChange = (event) => {
    setTexto(event.target.value);
  };

  const handleSend = () => {
    // Aquí puedes hacer algo con el texto capturado, por ejemplo, enviarlo a través de una función o hacer alguna operación.
    console.log('Texto capturado:', texto);
  };


  const handleenviar = async (e) => {
    
   
  
     setTexto("")
    
  };





  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearInterval(timerInterval);
        const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'grabacion.mpeg'); // Asegúrate de reemplazar 'grabacion.webm' con el nombre deseado para el archivo de audio

        // Realiza la solicitud POST al servidor
        fetch('http://localhost:3001/audio', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (response.ok) {
            console.log('¡El archivo de audio se envió correctamente!');
          } else {
            console.error('Error al enviar el archivo de audio:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error al enviar el archivo de audio:', error);
        });
        // Guardar el audio en la carpeta "audio"
        saveAudioToFile(audioBlob);
      };

      recorder.start();
      setStartTime(Date.now());
      const interval = setInterval(updateRecordingTime, 1000);
      setTimerInterval(interval);

      setAudioChunks(chunks);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      clearInterval(timerInterval);
      mediaRecorder.stop();
    }
  };

  const updateRecordingTime = () => {
    const currentTimeMillis = Date.now() - startTime;
    const minutes = Math.floor(currentTimeMillis / 60000);
    const seconds = Math.floor((currentTimeMillis % 60000) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    console.log("Tiempo de grabación:", formattedTime);
  };

  const handleRecordButtonClick = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopRecording();
      setGrabando(false); // Cuando se detiene la grabación, se establece grabando en false

    } else {
      startRecording();
      setGrabando(true);
    }
  };

  const saveAudioToFile = (audioBlob) => {
    const fileName = `audio_${Date.now()}.webm`;
    const audioUrl = URL.createObjectURL(audioBlob);

    // Crear un elemento "a" para descargar el archivo
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = fileName;

    // Simular el clic para iniciar la descarga
    downloadLink.click();
  };

  return (
    <div className="input">
      <input
      type="text"
      placeholder="Presiona el micrófono y luego pronuncia la frase ⮕"
      value={texto}
      readOnly={true}
      style={{ color: 'black' }}
    />
     <div className="send">
          <img
            src={"https://cdn-icons-png.flaticon.com/512/17/17303.png"}
            alt=""
            onClick={handleRecordButtonClick}
            style={{ cursor: 'pointer' }}
          />
        {grabando && <div style={{ marginLeft: '10px', fontSize: '14px', color: 'red' }}>Grabando...</div>}

        
      </div>
    </div>
  );
};


export default Input