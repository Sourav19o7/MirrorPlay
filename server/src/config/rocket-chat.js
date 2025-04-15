const { driver } = require('@rocket.chat/sdk');
const logger = require('../utils/logger');

const ROCKET_CHAT_URL = process.env.ROCKET_CHAT_URL;
const ADMIN_USERNAME = process.env.ROCKET_CHAT_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ROCKET_CHAT_ADMIN_PASSWORD;

// Initialize Rocket.Chat connection
const initRocketChat = async () => {
  try {
    // Connect to Rocket.Chat server
    await driver.connect({ host: ROCKET_CHAT_URL, useSsl: true });
    
    // Login with admin user to perform operations
    await driver.login({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    
    logger.info('Connected to Rocket.Chat server');
    
    return driver;
  } catch (error) {
    logger.error(`Rocket.Chat connection error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  initRocketChat,
  driver
};