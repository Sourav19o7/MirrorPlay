const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/config/db');
const { initPinecone } = require('./src/config/pinecone');
const { testOpenAIConnection } = require('./src/config/openai');
const logger = require('./src/utils/logger');
const WebSocket = require('ws'); // You'll need to install this package

const server = http.createServer(app);

// WebSocket server for real-time chat
const wss = new WebSocket.Server({ server });

// Store active connections
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('/').pop(); // Extract user ID from URL
  
  // Store the connection
  clients.set(userId, ws);
  
  logger.info(`WebSocket connection established for user: ${userId}`);
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      
      // Handle different message types
      switch (parsedMessage.type) {
        case 'chat':
          handleChatMessage(parsedMessage, userId);
          break;
        case 'typing':
          broadcastTypingStatus(parsedMessage.roomId, userId, parsedMessage.isTyping);
          break;
        default:
          logger.warn(`Unknown message type: ${parsedMessage.type}`);
      }
    } catch (error) {
      logger.error(`WebSocket message error: ${error.message}`);
    }
  });
  
  // Handle connection close
  ws.on('close', () => {
    clients.delete(userId);
    logger.info(`WebSocket connection closed for user: ${userId}`);
  });
  
  // Send a welcome message
  ws.send(JSON.stringify({
    type: 'system',
    message: 'Connected to MirrorPlay WebSocket server'
  }));
});

// Handle chat messages
const handleChatMessage = async (message, senderId) => {
  try {
    // Store message in database (implementation depends on your service)
    // const savedMessage = await chatService.sendMessage(message.roomId, message.content, senderId);
    
    // Get room members
    // const room = await ChatRoom.findById(message.roomId).select('members');
    const room = { members: [] }; // Placeholder until you implement the above line
    
    // Broadcast to all members of the room
    if (room && room.members) {
      room.members.forEach(member => {
        const memberWs = clients.get(member.toString());
        
        if (memberWs && memberWs.readyState === WebSocket.OPEN) {
          memberWs.send(JSON.stringify({
            type: 'chat',
            roomId: message.roomId,
            senderId,
            content: message.content,
            timestamp: new Date().toISOString()
          }));
        }
      });
    }
  } catch (error) {
    logger.error(`Error handling chat message: ${error.message}`);
  }
};

// Broadcast typing status
const broadcastTypingStatus = (roomId, userId, isTyping) => {
  try {
    // Implementation would be similar to handleChatMessage
    // Get room members and broadcast to all except the sender
    logger.info(`User ${userId} is ${isTyping ? 'typing' : 'stopped typing'} in room ${roomId}`);
  } catch (error) {
    logger.error(`Error broadcasting typing status: ${error.message}`);
  }
};

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
    pinecone: false,
    openAI: false
  };

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
  
  // Close all WebSocket connections
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'system',
        message: 'Server shutting down'
      }));
      client.close();
    }
  });
  
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
    logger.info(`WebSocket server enabled for real-time chat`);
    
    // Initialize other services after server is running
    initServices().then(serviceStatus => {
      // Additional checks or notifications if needed
    });
  });
};

startServer();