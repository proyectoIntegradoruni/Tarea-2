import React from 'react';
import App from './Login.jsx';
import { AppRouter } from './AppRouter';
//https://edea.juntadeandalucia.es/bancorecursos/file/41832ff2-cfcb-4923-ac63-5abdf63e5087/1/CDI_1BAC_REA_01_v01.zip/gif_animado_narrador_juvenil.gif
function AppI() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: 'url("https://preview.redd.it/dibujo-random-v0-9gscbh81n8rb1.png?auto=webp&s=fa5705c429e769d1bc47217f0017aaaf7ad027f1")',
    backgroundSize: 'cover',
  };

  return (
    <div >
      <AppRouter/>
      
    </div>
  );
}


export default AppI