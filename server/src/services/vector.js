const { pinecone } = require('../config/pinecone');
const { openai } = require('../config/openai');
const logger = require('../utils/logger');
const ErrorResponse = require('../utils/errorResponse');

const INDEX_NAME = 'mirrorplay-messages';

// Create embedding for a message and store in Pinecone
exports.createEmbedding = async (text) => {
  try {
    // Generate embedding with OpenAI
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    const embedding = embeddingResponse.data.data[0].embedding;
    
    // Store in Pinecone
    const index = pinecone.Index(INDEX_NAME);
    
    const id = `msg_${Date.now()}`;
    await index.upsert({
      upsertRequest: {
        vectors: [{
          id,
          values: embedding,
          metadata: {
            text,
            timestamp: new Date().toISOString()
          }
        }]
      }
    });
    
    logger.info(`Vector stored with ID: ${id}`);
    return { id, embedding };
  } catch (error) {
    logger.error(`Error creating embedding: ${error.message}`);
    throw new ErrorResponse('Failed to create embedding', 500);
  }
};

// Search for similar messages
exports.findSimilarMessages = async (text, limit = 5) => {
  try {
    // Generate embedding for the query text
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    const embedding = embeddingResponse.data.data[0].embedding;
    
    // Search in Pinecone
    const index = pinecone.Index(INDEX_NAME);
    
    const queryResponse = await index.query({
      queryRequest: {
        vector: embedding,
        topK: limit,
        includeMetadata: true
      }
    });
    
    return queryResponse.matches.map(match => ({
      id: match.id,
      text: match.metadata.text,
      score: match.score,
      timestamp: match.metadata.timestamp
    }));
  } catch (error) {
    logger.error(`Error finding similar messages: ${error.message}`);
    throw new ErrorResponse('Failed to find similar messages', 500);
  }
};

// Find communication patterns based on message history
exports.findPatterns = async (sessionId, limit = 50) => {
  try {
    // This would involve analyzing vectors from Pinecone and 
    // potentially using additional AI to identify patterns
    
    // For now, return placeholder data
    return {
      patternFound: true,
      patterns: [
        {
          type: 'repetition',
          description: 'User tends to repeat the same concern in different ways'
        },
        {
          type: 'escalation',
          description: 'Emotional intensity increases when discussing specific topics'
        }
      ]
    };
  } catch (error) {
    logger.error(`Error finding patterns: ${error.message}`);
    throw new ErrorResponse('Failed to find patterns', 500);
  }
};