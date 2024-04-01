import React, { useEffect, useState } from 'react';

import Img from "./img/img.png"
import Attach from "./img/attach.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

  let audioUser = ""
//import axios from 'axios';
const Input = ({asesor}) => {
  const [texto, setTexto] = useState('');
  const [grabando, setGrabando] = useState(false); // Estado para indicar si se está grabando o no
  const palabrass = localStorage.getItem('palabra')


  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [obtenidaP, setObtenidaP] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");


  const [verificado, setVerificado] = useState(false);
  const [primeravez,setPrimeravez]= useState(true);

  useEffect(() => {
    // Recuperar el nombre de usuario del almacenamiento local
    const nombre = localStorage.getItem('nombreUsuario');
    if (nombre) {
      setNombreUsuario(nombre);
    }
  }, []);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaRecorder(recorder);
      audioUser=""//resetiar el audio
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        clearInterval(timerInterval);
        const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'grabacion.mpeg'); // Asegúrate de reemplazar 'grabacion.webm' con el nombre deseado para el archivo de audio

        fetch('https://tarea-2.onrender.com/audio', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (response.ok) {
            console.log('¡El archivo de audio se envió correctamente!');
            return response.json(); // Devuelve la respuesta como JSON para poder acceder a la transcripción
          } else {
            console.error('Error al enviar el archivo de audio:', response.statusText);
            throw new Error('Error al enviar el archivo de audio');
          }
        })
        .then(data => {
          // Manejar la transcripción obtenida del backend
          setObtenidaP(data.transcripcion)
          localStorage.setItem('transcripcion',data.transcripcion)
          console.log('Transcripción:', data.transcripcion,'palabra obtenida : ', palabrass);
          if (!primeravez) {
            setTimeout(() => {
              verificar();
          }, 3000); // Llama a verificar después de 3 segundos // Llama a verificar después de que setObtenidaP haya completado su actualización
          }
        })

        
        .catch(error => {
          console.error('Error al enviar el archivo de audio:', error);
        });
        // Guardar el audio en la carpeta "audio"
        saveAudioToFile(audioBlob);

        // Crear un FileReader
        const reader = new FileReader();

        // Cuando la lectura esté completa, ejecutar esta función
        reader.onload = async function(event) {
            // Obtener el contenido del archivo en base64
            const base64Data = event.target.result;
            audioUser = base64Data
            // Aquí puedes hacer lo que necesites con la base64Data, como enviarla mediante una solicitud HTTP
            
            // Por ejemplo, puedes loguearla en la consola para verla
            console.log(base64Data);

            // Crear un nuevo mensaje del usuario para indicar la categoría seleccionada
            const newMessageUser1 = {
              remitente:`${nombreUsuario}` , // El remitente es "Pronunciacion" porque es el sistema de pronunciación
              destinatario:  "Pronunciacion", // El destinatario es el usuario actual
              contenido: `${audioUser}`,
              reproduccion: false // No se reproduce este mensaje
            };
            //peticion mandole  mensaje  de la transcripcion 
            const fetchResponse1 = await fetch('https://tarea-2.onrender.com/mensaje', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newMessageUser1)
            });
        
            // Verificar si la primera solicitud fue exitosa
            if (!fetchResponse1.ok) {
              throw new Error('Error al enviar el mensaje 1');
            }

            // Llamar a la función verificar después de que se haya enviado el mensaje
            
        };

        // Leer el blob como un dato de URL
        reader.readAsDataURL(audioBlob);

        
        
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

  const verificar = async () => {
    
    const palabraobt = localStorage.getItem('transcripcion')
    console.log('Transcripción:', palabraobt,'palabra obtenida : ', palabrass);
    const p1 = palabrass.toLowerCase().trim()
    const p2 =localStorage.getItem('transcripcion').toLowerCase().trim()
    localStorage.setItem('reiniciocategorias', true);
    console.log(palabrass == obtenidaP)
    if (p1 == p2) {
      console.log("felicitaciones")
      // Crear un nuevo mensaje del usuario para indicar la categoría seleccionada
      const newMessageUser1 = {
        remitente:"Pronunciacion" , // El remitente es "Pronunciacion" porque es el sistema de pronunciación
        destinatario:  `${nombreUsuario}`, // El destinatario es el usuario actual
        contenido: `Felicitaciones, pronunciaste correctamente ${localStorage.getItem('transcripcion')}`,
        reproduccion: false // No se reproduce este mensaje
      };
      //peticion mandole  mensaje  de la transcripcion 
      const fetchResponse1 = await fetch('https://tarea-2.onrender.com/mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessageUser1)
      });
  
      // Verificar si la primera solicitud fue exitosa
      if (!fetchResponse1.ok) {
        throw new Error('Error al enviar el mensaje 1');
      }
      
    }
    else 
    {
      console.log("fallaste")
      // Crear un nuevo mensaje del usuario para indicar la categoría seleccionada
      const newMessageUser1 = {
        remitente:"Pronunciacion" , // El remitente es "Pronunciacion" porque es el sistema de pronunciación
        destinatario:  `${nombreUsuario}`, // El destinatario es el usuario actual
        contenido: `Hey ${nombreUsuario}, no pronunciaste correctamente. Dijiste "${localStorage.getItem('transcripcion')}" en vez de "${palabrass}". Escucha de nuevo el audio e inténtalo de nuevo.`,
        reproduccion: false // No se reproduce este mensaje
      };
      //peticion mandole  mensaje  de la transcripcion 
      const fetchResponse1 = await fetch('https://tarea-2.onrender.com/mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessageUser1)
      });
  
      // Verificar si la primera solicitud fue exitosa
      if (!fetchResponse1.ok) {
        throw new Error('Error al enviar el mensaje 1');
      }
    }
   
  };
  

  useEffect(() => {
      // Verificar si obtenidaP no está vacío, el proceso de carga del archivo ha finalizado y verificar no ha sido ejecutado antes
      if (obtenidaP !== "" && audioUser !== "" && !verificado) {
          verificar(); // Ejecutar la función verificar
          setVerificado(true); // Actualizar el estado para indicar que verificar ha sido ejecutado
          setPrimeravez(false)
          setPrimeravez(false)
      }
  }, [obtenidaP, audioUser, verificado]); // Dependencias que activan el efecto

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