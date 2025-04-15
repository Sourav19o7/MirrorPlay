import api from './api';
import { RocketChat } from '@rocket.chat/sdk';

// Initialize Rocket.Chat client
const rocketChat = new RocketChat({
  host: process.env.REACT_APP_ROCKET_CHAT_URL,
  useSsl: true
});

const chatService = {
  // Send message
  sendMessage: async (sessionId, content) => {
    return api.post(`/sessions/${sessionId}/messages`, { content });
  },
  
  // Initialize Rocket.Chat connection
  initRocketChat: async (username, password) => {
    try {
      await rocketChat.login({ username, password });
      return true;
    } catch (error) {
      console.error('Rocket.Chat initialization error:', error);
      return false;
    }
  },
  
  // Join a chat room
  joinRoom: async (roomId) => {
    try {
      await rocketChat.joinRoom(roomId);
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  },
  
  // Subscribe to room messages
  subscribeToRoom: async (roomId, callback) => {
    try {
      const subscription = await rocketChat.subscribeToMessages(roomId);
      
      subscription.onMessage((message) => {
        callback(message);
      });
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to room:', error);
      return null;
    }
  },
  
  // Unsubscribe from room
  unsubscribeFromRoom: async (subscription) => {
    if (subscription) {
      subscription.unsubscribe();
    }
  },
  
  // Send message to Rocket.Chat room
  sendRocketChatMessage: async (roomId, text) => {
    try {
      const messageId = await rocketChat.sendMessage(text, roomId);
      return messageId;
    } catch (error) {
      console.error('Error sending message to Rocket.Chat:', error);
      throw error;
    }
  },
  
  // Logout from Rocket.Chat
  logoutRocketChat: async () => {
    try {
      await rocketChat.logout();
      return true;
    } catch (error) {
      console.error('Rocket.Chat logout error:', error);
      return false;
    }
  }
};

export default chatService;