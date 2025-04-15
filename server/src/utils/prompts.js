/**
 * AI prompt templates for different functionalities
 */

// Generate shadow self for Self-Self dialogue
exports.generateShadowPrompt = (context, personality, topics) => {
    return `
    I want you to act as a shadow version of me for a self-dialogue exercise. 
    
    My context: ${context}
    
    Topics I want to discuss: ${topics.join(', ')}
    
    Personality traits to emphasize in the shadow: ${personality.join(', ')}
    
    Create a coherent personality for this shadow version that can help me explore my thoughts. 
    This shadow should represent aspects of myself that I might not always acknowledge.
    
    Respond as this shadow version with a brief introduction of how you see yourself in relation to me.
    `;
  };
  
  // Generate projected other for Self-Other dialogue
  exports.generateProjectedPrompt = (relationship, characteristics, context, topics) => {
    return `
    I want you to act as ${relationship} for a dialogue practice exercise.
    
    Their key characteristics as I perceive them: ${characteristics.join(', ')}
    
    Our context: ${context}
    
    Topics I want to discuss: ${topics.join(', ')}
    
    Create a coherent personality for this projected version of ${relationship} that can help me practice this conversation.
    This should represent how I perceive them, which may not be entirely accurate.
    
    Respond as this projected version with a brief introduction in their voice.
    `;
  };
  
  // Analyze message emotions
  exports.analyzeEmotionsPrompt = (message) => {
    return `
    Analyze the emotional content of this message:
    
    "${message}"
    
    Provide the following:
    1. Primary emotion detected
    2. Secondary emotions detected
    3. Emotional intensity (1-10)
    4. Is this a bid for connection? (yes/no)
    5. Does this message contain blame language? (yes/no)
    
    Format your response as JSON only, with no additional text.
    `;
  };
  
  // Generate coaching suggestions
  exports.coachingSuggestionsPrompt = (message, context, sessionMode) => {
    return `
    Generate 3 coaching suggestions based on this message:
    
    "${message}"
    
    Context: ${context}
    Session mode: ${sessionMode}
    
    For each suggestion, provide:
    1. Type (reframe, reflection, question, validation, or clarification)
    2. The suggestion text
    3. If type is "reframe", also include the original problematic text
    
    Format your response as JSON only, with no additional text. The JSON should have a "suggestions" array with each suggestion as an object.
    `;
  };
  
  // Generate dialogue response
  exports.dialogueResponsePrompt = (mode, history, persona) => {
    let systemPrompt = '';
    
    if (mode === 'self-dialogue') {
      systemPrompt = `You are acting as a shadow version of the user with these traits: ${persona.personality.join(', ')}. 
      This is a self-dialogue exercise to help the user integrate inner conflicts and gain self-awareness.
      Respond thoughtfully as this shadow self, exploring the user's thoughts and feelings from a different perspective.
      Keep responses concise (3-5 sentences) and focused on helping the user gain insights.`;
    } else if (mode === 'projected-conflict') {
      systemPrompt = `You are acting as ${persona.relationship} with these characteristics: ${persona.characteristics.join(', ')}.
      This is a projected conversation exercise to help the user practice difficult conversations.
      Respond as this person would, based on the user's perception of them.
      Keep responses realistic, neither too confrontational nor too accommodating.
      Focus on helping the user practice effective communication strategies.`;
    }
    
    return {
      systemPrompt,
      history
    };
  };
  
  // Generate session summary
  exports.sessionSummaryPrompt = (messages, sessionInfo) => {
    return `
    Generate a summary of this conversation:
    
    ${JSON.stringify(messages)}
    
    Session info: ${JSON.stringify(sessionInfo)}
    
    Include in your summary:
    1. Overall clarity score (1-100)
    2. Key moments of connection
    3. Potential misunderstandings
    4. Growth opportunities for each participant
    5. 3 insights from the conversation
    
    Format your response as JSON only, with no additional text.
    `;
  };