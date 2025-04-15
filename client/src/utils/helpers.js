import { format, parseISO } from 'date-fns';
import { EMOTIONS, SESSION_MODES } from './constants';

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @param {string} formatString - format pattern (default: 'MMM d, yyyy')
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, formatString = 'MMM d, yyyy') => {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date with time
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date and time
 */
export const formatDateTime = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

/**
 * Format time from date string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time
 */
export const formatTime = (dateString) => {
  try {
    return format(parseISO(dateString), 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Get session mode display name
 * @param {string} mode - Session mode
 * @returns {string} - Display name for the mode
 */
export const getSessionModeLabel = (mode) => {
  switch (mode) {
    case SESSION_MODES.SELF_DIALOGUE:
      return 'Self-Self Dialogue';
    case SESSION_MODES.PROJECTED_CONFLICT:
      return 'Projected Conflict';
    case SESSION_MODES.LIVE_SESSION:
      return 'Live Session';
    default:
      return 'Unknown Mode';
  }
};

/**
 * Get emotion color based on the emotion type
 * @param {string} emotion - Emotion type
 * @returns {string} - MUI color name
 */
export const getEmotionColor = (emotion) => {
  if ([EMOTIONS.HAPPY, EMOTIONS.HOPEFUL, EMOTIONS.EMPATHETIC].includes(emotion)) {
    return 'success';
  }
  if ([EMOTIONS.ANGRY, EMOTIONS.FRUSTRATED, EMOTIONS.DEFENSIVE].includes(emotion)) {
    return 'error';
  }
  if ([EMOTIONS.SAD, EMOTIONS.ANXIOUS].includes(emotion)) {
    return 'warning';
  }
  if ([EMOTIONS.CONFUSED].includes(emotion)) {
    return 'info';
  }
  return 'default';
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} - Initials (maximum 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const words = name.trim().split(' ');
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Handle API errors
 * @param {Error} error - Error object from API call
 * @returns {string} - Formatted error message
 */
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};