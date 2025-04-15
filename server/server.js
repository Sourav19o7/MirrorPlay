const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/config/db');
const { initRocketChat } = require('./src/config/rocket-chat');
const { initPinecone } = require('./src/config/pinecone');
const { testOpenAIConnection } = require('./src/config/openai');
const logger = require('./src/utils/logger');

const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize services
const initServices = async () => {
  try {
    // Initialize Rocket.Chat connection
    await initRocketChat();
    
    // Initialize Pinecone
    await initPinecone();
    
    // Test OpenAI connection
    await testOpenAIConnection();
    
    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error(`Error initializing services: ${error.message}`);
    logger.error('Server will continue to run, but some features may be limited');
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  initServices();
});