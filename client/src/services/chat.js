import api from './api';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

const chatService = {
  // Send message to the API
  sendMessage: async (sessionId, content) => {
    return api.post(`/sessions/${sessionId}/messages`, { content });
  },
  
  // Initialize chat connection (replaces Rocket.Chat initialization)
  initChat: async (username) => {
    try {
      // We can use local storage to store chat session info
      localStorage.setItem('chat_username', username);
      localStorage.setItem('chat_session_id', uuidv4());
      return true;
    } catch (error) {
      console.error('Chat initialization error:', error);
      return false;
    }
  },
  
  // Join a chat room
  joinRoom: async (roomId) => {
    try {
      // Store the current active room in local storage
      localStorage.setItem('chat_current_room', roomId);
      // Notify backend about joining the room
      await api.post(`/chat/join`, { roomId });
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  },
  
  // Subscribe to room messages using polling or WebSocket
  subscribeToRoom: async (roomId, callback) => {
    try {
      // Create a subscription ID to identify this subscription
      const subscriptionId = uuidv4();
      
      // Use WebSocket if available, or fall back to polling
      if (window.WebSocket) {
        // Implementation would depend on your backend WebSocket setup
        console.log('WebSocket would be initialized here');
        
        // Example WebSocket setup (uncomment and customize when you have a WebSocket server)
        /*
        const socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/chat/${roomId}`);
        
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          callback(message);
        };
        
        // Store the socket reference for later cleanup
        window.chatSubscriptions = window.chatSubscriptions || {};
        window.chatSubscriptions[subscriptionId] = socket;
        */
      } else {
        // Polling fallback
        console.log('Falling back to polling for messages');
        const pollInterval = setInterval(async () => {
          try {
            const response = await api.get(`/chat/messages/${roomId}`);
            if (response.data && response.data.messages) {
              response.data.messages.forEach(message => {
                callback(message);
              });
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 3000); // Poll every 3 seconds
        
        // Store the interval for later cleanup
        window.chatSubscriptions = window.chatSubscriptions || {};
        window.chatSubscriptions[subscriptionId] = { 
          type: 'polling',
          interval: pollInterval 
        };
      }
      
      return {
        id: subscriptionId,
        unsubscribe: () => chatService.unsubscribeFromRoom({ id: subscriptionId })
      };
    } catch (error) {
      console.error('Error subscribing to room:', error);
      return null;
    }
  },
  
  // Unsubscribe from room
  unsubscribeFromRoom: async (subscription) => {
    if (!subscription || !subscription.id) return;
    
    const subscriptions = window.chatSubscriptions || {};
    const sub = subscriptions[subscription.id];
    
    if (sub) {
      if (sub.type === 'polling' && sub.interval) {
        clearInterval(sub.interval);
      } else if (sub.close) {
        // It's a WebSocket
        sub.close();
      }
      
      delete subscriptions[subscription.id];
    }
  },
  
  // Send message to chat room
  sendChatMessage: async (roomId, text) => {
    try {
      const response = await api.post(`/chat/messages`, {
        roomId,
        content: text,
        timestamp: new Date().toISOString()
      });
      
      return response.data.messageId;
    } catch (error) {
      console.error('Error sending message to chat:', error);
      throw error;
    }
  },
  
  // Logout from chat
  logoutChat: async () => {
    try {
      // Clear chat-related local storage
      localStorage.removeItem('chat_username');
      localStorage.removeItem('chat_session_id');
      localStorage.removeItem('chat_current_room');
      
      // Clean up any active subscriptions
      const subscriptions = window.chatSubscriptions || {};
      Object.keys(subscriptions).forEach(id => {
        const sub = subscriptions[id];
        if (sub.type === 'polling' && sub.interval) {
          clearInterval(sub.interval);
        } else if (sub.close) {
          sub.close();
        }
      });
      
      window.chatSubscriptions = {};
      
      return true;
    } catch (error) {
      console.error('Chat logout error:', error);
      return false;
    }
  }
};

export default chatService;