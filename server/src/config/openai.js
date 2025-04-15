const { Configuration, OpenAIApi } = require('openai');
const logger = require('../utils/logger');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Test the OpenAI connection
const testOpenAIConnection = async () => {
  try {
    const response = await openai.listModels();
    logger.info('OpenAI connection successful');
    return true;
  } catch (error) {
    logger.error(`OpenAI connection error: ${error.message}`);
    return false;
  }
};

module.exports = {
  openai,
  testOpenAIConnection
};