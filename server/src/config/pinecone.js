const { PineconeClient } = require('@pinecone-database/pinecone');
const logger = require('../utils/logger');

let pinecone = new PineconeClient();
const INDEX_NAME = 'mirrorplay-messages';

const initPinecone = async () => {
  try {
    // Check if required environment variables are set
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
      logger.warn('Pinecone API credentials not found. Vector search features will be disabled.');
      return null;
    }
    
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // Verify the connection by listing indexes
    const indexList = await pinecone.listIndexes();
    
    // Check if our required index exists
    const indexExists = indexList.includes(INDEX_NAME);
    
    if (!indexExists) {
      logger.warn(`Pinecone index '${INDEX_NAME}' not found. Vector search features may not work properly.`);
      
      // Optionally, we could create the index here
      // This depends on your application requirements
    }
    
    logger.info('Connected to Pinecone successfully');
    return pinecone;
  } catch (error) {
    logger.error(`Pinecone connection error: ${error.message}`);
    
    // Reset pinecone instance
    pinecone = new PineconeClient();
    return null;
  }
};

// Get a Pinecone index safely with error handling
const getIndex = async (indexName = INDEX_NAME) => {
  try {
    if (!pinecone || !pinecone.projectId) {
      logger.warn('Pinecone not initialized. Attempting to reconnect...');
      await initPinecone();
    }
    
    if (!pinecone || !pinecone.projectId) {
      return null;
    }
    
    return pinecone.Index(indexName);
  } catch (error) {
    logger.error(`Error getting Pinecone index: ${error.message}`);
    return null;
  }
};

module.exports = {
  initPinecone,
  pinecone,
  getIndex
};