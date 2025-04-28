// server/src/utils/generateToken.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate a JWT token for API authentication
 * @param {Object} payload - Data to include in the token
 * @returns {String} - Generated JWT token
 */
const generateToken = (payload = {}) => {
  // Use the env JWT_SECRET or a default for development
  const secret = process.env.JWT_SECRET || 'your_default_secret_key';
  
  // If no UUID is provided, generate one
  if (!payload.uuid) {
    payload.uuid = crypto.randomUUID();
  }
  
  // Generate and return the token
  return jwt.sign(payload, secret);
};

/**
 * Generate a token with just a UUID
 * @returns {String} - Generated JWT token with UUID
 */
const generateSimpleToken = () => {
  const uuid = crypto.randomUUID();
  return generateToken({ uuid });
};

/**
 * Generate a token with UUID and question (as shown in Postman example)
 * @param {String} question - The question to include in the token
 * @returns {String} - Generated JWT token with UUID and question
 */
const generateQuestionToken = (question) => {
  return generateToken({
    uuid: crypto.randomUUID(),
    question
  });
};

module.exports = {
  generateToken,
  generateSimpleToken,
  generateQuestionToken
};