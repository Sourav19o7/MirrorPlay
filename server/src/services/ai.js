const { safeOpenAICall } = require('../config/openai');
const prompts = require('../utils/prompts');
const vectorService = require('./vector');
const logger = require('../utils/logger');
const ErrorResponse = require('../utils/errorResponse');

// Helper to handle fallback responses when OpenAI fails
const getFallbackResponse = (type) => {
  switch (type) {
    case 'shadow':
      return {
        introduction: "I'm here to help you explore your thoughts. What would you like to discuss today?",
        personality: ["reflective", "curious", "supportive"],
        topics: ["self-reflection"]
      };
    case 'projected':
      return {
        introduction: "Let's practice this conversation. I'll try to respond as the person you described.",
        relationship: "conversation partner",
        characteristics: ["understanding", "responsive"],
        topics: ["communication"]
      };
    case 'emotions':
      return {
        primaryEmotion: "neutral",
        secondaryEmotions: [],
        intensity: 5,
        isBidForConnection: false,
        containsBlame: false
      };
    case 'suggestions':
      return [
        {
          type: "reflection",
          content: "Would you like to explore that thought further?"
        },
        {
          type: "question",
          content: "How did you feel when that happened?"
        }
      ];
    case 'dialogue':
      return "I understand your perspective. Can you tell me more about how you feel about this situation?";
    case 'summary':
      return {
        clarityScore: 70,
        keyMoments: [],
        patterns: ["reflective listening"],
        misunderstandings: [],
        growthOpportunities: ["express emotions more clearly"]
      };
    default:
      return { message: "AI response unavailable" };
  }
};

// Generate a shadow self for Self-Self dialogue
exports.generateShadowSelf = async (context, personality, topics) => {
  try {
    const prompt = prompts.generateShadowPrompt(context, personality, topics);
    
    const completion = await safeOpenAICall('createChatCompletion', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that helps users engage in productive self-dialogue by creating a 'shadow self' persona that can engage with them thoughtfully." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const shadowResponse = completion.data.choices[0].message.content;
    
    return {
      introduction: shadowResponse,
      personality,
      topics,
    };
  } catch (error) {
    logger.error(`Error generating shadow self: ${error.message}`);
    
    // Return a fallback response instead of throwing
    logger.info('Using fallback response for shadow self generation');
    return getFallbackResponse('shadow');
  }
};

// Generate a projected other for Self-Other dialogue
exports.generateProjectedOther = async (relationship, characteristics, context, topics) => {
  try {
    const prompt = prompts.generateProjectedPrompt(relationship, characteristics, context, topics);
    
    const completion = await safeOpenAICall('createChatCompletion', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that helps users practice difficult conversations by creating a projected version of another person based on the user's perception." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const projectedResponse = completion.data.choices[0].message.content;
    
    return {
      introduction: projectedResponse,
      relationship,
      characteristics,
      topics,
    };
  } catch (error) {
    logger.error(`Error generating projected other: ${error.message}`);
    
    // Return a fallback response
    logger.info('Using fallback response for projected other generation');
    return getFallbackResponse('projected');
  }
};

// Analyze emotions in a message
exports.analyzeEmotions = async (message) => {
  try {
    const prompt = prompts.analyzeEmotionsPrompt(message);
    
    const completion = await safeOpenAICall('createChatCompletion', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that analyzes the emotional content of messages to help improve communication." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    
    // Parse response as JSON
    const analysisText = completion.data.choices[0].message.content;
    let analysis;
    
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      logger.error(`Error parsing emotion analysis: ${parseError.message}`);
      analysis = getFallbackResponse('emotions');
    }
    
    // Store message embedding in vector database
    let embedding = { id: null };
    
    try {
      embedding = await vectorService.createEmbedding(message);
    } catch (vectorError) {
      logger.error(`Error creating vector embedding: ${vectorError.message}`);
      // Continue without vector embedding
    }
    
    return {
      ...analysis,
      vectorId: embedding.id
    };
  } catch (error) {
    logger.error(`Error analyzing emotions: ${error.message}`);
    
    // Return a fallback response
    const fallback = getFallbackResponse('emotions');
    return {
      ...fallback,
      vectorId: null
    };
  }
};

// Generate coaching suggestions
exports.getCoachingSuggestions = async (message, context, sessionMode) => {
  try {
    const prompt = prompts.coachingSuggestionsPrompt(message, context, sessionMode);
    
    const completion = await safeOpenAICall('createChatCompletion', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that provides coaching suggestions to help improve communication in difficult conversations." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    // Parse response as JSON
    const suggestionsText = completion.data.choices[0].message.content;
    let suggestions;
    
    try {
      suggestions = JSON.parse(suggestionsText);
    } catch (parseError) {
      logger.error(`Error parsing suggestions: ${parseError.message}`);
      suggestions = { suggestions: getFallbackResponse('suggestions') };
    }
    
    return suggestions.suggestions || suggestions;
  } catch (error) {
    logger.error(`Error generating coaching suggestions: ${error.message}`);
    
    // Return fallback suggestions
    return getFallbackResponse('suggestions');
  }
};

// Generate dialogue response
exports.generateDialogueResponse = async (mode, userMessage, persona, history) => {
  try {
    // Format the conversation history
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // Add the latest user message
    formattedHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Get prompt based on mode
    const { systemPrompt } = prompts.dialogueResponsePrompt(mode, formattedHistory, persona);
    
    // Call OpenAI
    const completion = await safeOpenAICall('createChatCompletion', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const response = completion.data.choices[0].message.content;
    
    return response;
  } catch (error) {
    logger.error(`Error generating dialogue response: ${error.message}`);
    
    // Return a fallback response
    return getFallbackResponse('dialogue');
  }
};

// Generate session summary
exports.generateSessionSummary = async (messages, sessionInfo) => {
  try {
    const prompt = prompts.sessionSummaryPrompt(messages, sessionInfo);
    
    const completion = await safeOpenAICall('createChatCompletion', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI that summarizes conversations to provide insights and growth opportunities." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    // Parse response as JSON
    const summaryText = completion.data.choices[0].message.content;
    let summary;
    
    try {
      summary = JSON.parse(summaryText);
    } catch (parseError) {
      logger.error(`Error parsing summary: ${parseError.message}`);
      summary = getFallbackResponse('summary');
    }
    
    return summary;
  } catch (error) {
    logger.error(`Error generating session summary: ${error.message}`);
    
    // Return a fallback summary
    return getFallbackResponse('summary');
  }
};