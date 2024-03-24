require('dotenv').config();
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');


const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.APIKEY,
  }),
  serviceUrl: process.env.URL,
  disableSslVerification: true,
});


const params = {
    objectMode: true,
    contentType: 'audio/mp3',
    model: 'es-CO_NarrowbandModel',
    //keywords: ['colorado', 'tornado', 'tornadoes'],
    //keywordsThreshold: 0.5,
    //maxAlternatives: 3,
  };


module.exports = {speechToText}