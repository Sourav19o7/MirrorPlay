const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/config/db');
const { initRocketChat, isConnected } = require('./src/config/rocket-chat');
const { initPinecone } = require('./src/config/pinecone');
const { testOpenAIConnection } = require('./src/config/openai');
const logger = require('./src/utils/logger');

const server = http.createServer(app);

// Connect to MongoDB with retry mechanism
const setupDatabase = async () => {
  try {
    await connectDB();
    return true;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    return false;
  }
};

// Initialize services with fault tolerance
const initServices = async () => {
  const serviceStatus = {
    rocketChat: false,
    pinecone: false,
    openAI: false
  };

  try {
    // Initialize Rocket.Chat connection
    const rocketChatDriver = await initRocketChat();
    serviceStatus.rocketChat = !!rocketChatDriver;
    
    if (!serviceStatus.rocketChat) {
      logger.warn('Rocket.Chat initialization failed. Chat features will be limited.');
    }
  } catch (error) {
    logger.error(`Rocket.Chat initialization error: ${error.message}`);
  }
  
  try {
    // Initialize Pinecone
    const pineconeClient = await initPinecone();
    serviceStatus.pinecone = !!pineconeClient;
    
    if (!serviceStatus.pinecone) {
      logger.warn('Pinecone initialization failed. Vector search features will be limited.');
    }
  } catch (error) {
    logger.error(`Pinecone initialization error: ${error.message}`);
  }
  
  try {
    // Test OpenAI connection
    serviceStatus.openAI = await testOpenAIConnection();
    
    if (!serviceStatus.openAI) {
      logger.warn('OpenAI connection failed. AI features will be limited.');
    }
  } catch (error) {
    logger.error(`OpenAI initialization error: ${error.message}`);
  }
  
  // Log overall service status
  const successfulServices = Object.entries(serviceStatus)
    .filter(([_, status]) => status)
    .map(([name]) => name);
  
  if (successfulServices.length === Object.keys(serviceStatus).length) {
    logger.info('All services initialized successfully');
  } else if (successfulServices.length > 0) {
    logger.warn(`Partial service initialization. Working services: ${successfulServices.join(', ')}`);
  } else {
    logger.error('All service initializations failed. Application functionality will be severely limited.');
  }
  
  return serviceStatus;
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  // Don't crash the server for unhandled rejections
});

// Handle uncaught exceptions - these are more serious
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  
  // For uncaught exceptions, we might want to exit gracefully after a delay
  // This gives time for existing connections to complete
  setTimeout(() => {
    logger.info('Server shutting down due to uncaught exception');
    server.close(() => process.exit(1));
  }, 3000);
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal. Closing server gracefully...');
  server.close(() => {
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force close after timeout
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const PORT = process.env.PORT || 5000;

// Initialize and start everything
const startServer = async () => {
  // First connect to database
  const dbConnected = await setupDatabase();
  
  if (!dbConnected) {
    logger.warn('Starting server with limited functionality due to database connection issues');
  }
  
  // Start HTTP server
  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Initialize other services after server is running
    initServices().then(serviceStatus => {
      // Add additional checks or notifications here if needed
      // For example, you could send an admin notification if critical services are down
    });
  });
};

startServer();