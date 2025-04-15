const { PineconeClient } = require('@pinecone-database/pinecone');
const logger = require('../utils/logger');

const pinecone = new PineconeClient();

const initPinecone = async () => {
  try {
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    logger.info('Connected to Pinecone');
    return pinecone;
  } catch (error) {
    logger.error(`Pinecone connection error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  initPinecone,
  pinecone
};