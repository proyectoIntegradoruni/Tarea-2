const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://rivaslina:qEqHkwUUMrtaG61u@taller1.7ujjqcr.mongodb.net/TallerI?retryWrites=true&w=majority', {
    });

    const url = `${mongoose.connection.host}:${mongoose.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = conectarDB;