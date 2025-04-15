const { Configuration, OpenAIApi } = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI configuration
const configuration = process.env.OPENAI_API_KEY 
  ? new Configuration({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize OpenAI API client if configuration is valid
const openai = configuration ? new OpenAIApi(configuration) : null;

// Test the OpenAI connection
const testOpenAIConnection = async () => {
  // Check if API key is configured
  if (!configuration || !openai) {
    logger.error('OpenAI API key not configured. AI features will be disabled.');
    return false;
  }
  
  try {
    const response = await openai.listModels();
    
    if (response.status === 200) {
      logger.info('OpenAI connection successful');
      return true;
    } else {
      logger.error(`OpenAI connection test failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logger.error(`OpenAI connection error: ${error.message}`);
    return false;
  }
};

// Safely call the OpenAI API with error handling
const safeOpenAICall = async (method, params, retries = 2) => {
  if (!openai) {
    logger.error('OpenAI client not initialized. Cannot make API call.');
    throw new Error('OpenAI client not initialized');
  }
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await openai[method](params);
    } catch (error) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : (2 ** attempt) * 1000;
        
        logger.warn(`OpenAI rate limit reached. Retrying after ${retryAfter}ms`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryAfter));
      } else if (attempt < retries) {
        // For other errors, retry with exponential backoff
        const backoff = (2 ** attempt) * 500;
        logger.warn(`OpenAI API call failed. Retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      } else {
        // No more retries, throw the error
        logger.error(`OpenAI API call failed after ${retries + 1} attempts: ${error.message}`);
        throw error;
      }
    }
  }
  
  throw lastError;
};

module.exports = {
  openai,
  testOpenAIConnection,
  safeOpenAICall
};