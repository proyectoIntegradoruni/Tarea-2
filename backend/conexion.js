const mongoose = require('mongoose');
require('dotenv').config();
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.APIMONGO, {
    });

    const url = `${mongoose.connection.host}:${mongoose.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;