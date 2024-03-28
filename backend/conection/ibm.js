require('dotenv').config();
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');


const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: "AjUoSfSaQ5W-4gerstpxHvCD0empCdSe-d65jCUZDjGF",
  }),
  serviceUrl: "https://api.au-syd.speech-to-text.watson.cloud.ibm.com/instances/79307fc3-6bde-4beb-ad02-a2906d2f3766",
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