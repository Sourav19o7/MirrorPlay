const { driver } = require('@rocket.chat/sdk');
const logger = require('../utils/logger');

const ROCKET_CHAT_URL = process.env.ROCKET_CHAT_URL;
const ADMIN_USERNAME = process.env.ROCKET_CHAT_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ROCKET_CHAT_ADMIN_PASSWORD;

// Initialize Rocket.Chat connection
const initRocketChat = async () => {
  try {
    // Check if configuration is available
    if (!ROCKET_CHAT_URL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
      logger.warn('Rocket.Chat configuration is missing. Chat features will be disabled.');
      return null;
    }

    // Connect to Rocket.Chat server
    await driver.connect({ host: ROCKET_CHAT_URL, useSsl: true });
    
    // Login with admin user to perform operations
    await driver.login({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    
    logger.info('Connected to Rocket.Chat server');

    // Set up connection monitoring
    driver.on('disconnected', () => {
      logger.warn('Rocket.Chat disconnected. Attempting to reconnect...');
      // Attempt to reconnect
      setTimeout(() => {
        initRocketChat().catch(err => {
          logger.error(`Rocket.Chat reconnection failed: ${err.message}`);
        });
      }, 5000);
    });
    
    return driver;
  } catch (error) {
    logger.error(`Rocket.Chat connection error: ${error.message}`);
    // Return null to indicate failure, but don't throw
    return null;
  }
};

// Check if Rocket.Chat is connected
const isConnected = () => {
  return driver && driver.connected;
};

// Safe method to call Rocket.Chat API
const safeRocketChatCall = async (method, ...args) => {
  if (!isConnected()) {
    logger.warn(`Rocket.Chat not connected. Skipping ${method} call.`);
    return null;
  }
  
  try {
    return await driver[method](...args);
  } catch (error) {
    logger.error(`Rocket.Chat ${method} error: ${error.message}`);
    return null;
  }
};

module.exports = {
  initRocketChat,
  driver,
  isConnected,
  safeRocketChatCall
};