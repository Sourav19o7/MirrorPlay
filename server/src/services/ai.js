const { openai } = require('../config/openai');
const prompts = require('../utils/prompts');
const vectorService = require('./vector');
const logger = require('../utils/logger');
const ErrorResponse = require('../utils/errorResponse');

// Generate a shadow self for Self-Self dialogue
exports.generateShadowSelf = async (context, personality, topics) => {
  try {
    const prompt = prompts.generateShadowPrompt(context, personality, topics);
    
    const completion = await openai.createChatCompletion({
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
    throw new ErrorResponse('Failed to generate shadow self', 500);
  }
};

// Generate a projected other for Self-Other dialogue
exports.generateProjectedOther = async (relationship, characteristics, context, topics) => {
  try {
    const prompt = prompts.generateProjectedPrompt(relationship, characteristics, context, topics);
    
    const completion = await openai.createChatCompletion({
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
    throw new ErrorResponse('Failed to generate projected other', 500);
  }
};

// Analyze emotions in a message
exports.analyzeEmotions = async (message) => {
  try {
    const prompt = prompts.analyzeEmotionsPrompt(message);
    
    const completion = await openai.createChatCompletion({
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
    const analysis = JSON.parse(analysisText);
    
    // Store message embedding in vector database
    const embedding = await vectorService.createEmbedding(message);
    
    return {
      ...analysis,
      vectorId: embedding.id
    };
  } catch (error) {
    logger.error(`Error analyzing emotions: ${error.message}`);
    throw new ErrorResponse('Failed to analyze emotions', 500);
  }
};

// Generate coaching suggestions
exports.getCoachingSuggestions = async (message, context, sessionMode) => {
  try {
    const prompt = prompts.coachingSuggestionsPrompt(message, context, sessionMode);
    
    const completion = await openai.createChatCompletion({
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
    const suggestions = JSON.parse(suggestionsText);
    
    return suggestions;
  } catch (error) {
    logger.error(`Error generating coaching suggestions: ${error.message}`);
    throw new ErrorResponse('Failed to generate coaching suggestions', 500);
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
    const completion = await openai.createChatCompletion({
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
    throw new ErrorResponse('Failed to generate dialogue response', 500);
  }
};

// Generate session summary
exports.generateSessionSummary = async (messages, sessionInfo) => {
  try {
    const prompt = prompts.sessionSummaryPrompt(messages, sessionInfo);
    
    const completion = await openai.createChatCompletion({
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
    const summary = JSON.parse(summaryText);
    
    return summary;
  } catch (error) {
    logger.error(`Error generating session summary: ${error.message}`);
    throw new ErrorResponse('Failed to generate session summary', 500);
  }
};