import authApi from './authApi';

// Helper to get headers
const getHeaders = () => {
  return { headers: {} };
};

/**
 * Fetch the detailed question-by-question review of a completed test attempt.
 *
 * @param {string|number} attemptId the unique ID of the test attempt
 * @returns {Promise<Object>} the AnswerReviewResponse data object
 */
export const getReview = async (attemptId) => {
  const response = await authApi.get(`/api/results/review/${attemptId}`, getHeaders());
  return response.data.data;
};
