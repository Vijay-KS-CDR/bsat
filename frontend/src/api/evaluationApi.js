import authApi from './authApi';

// Helper to get headers
const getHeaders = () => {
  return { headers: {} };
};

// GET /api/evaluations/pending
export const getPendingEvaluations = async () => {
  const response = await authApi.get('/api/evaluations/pending', getHeaders());
  return response.data;
};

// GET /api/evaluations/test/{testId}
export const getEvaluationsByTest = async (testId) => {
  const response = await authApi.get(`/api/evaluations/test/${testId}`, getHeaders());
  return response.data;
};

// GET /api/evaluations/attempt/{attemptId}
export const getEvaluationsByAttempt = async (attemptId) => {
  const response = await authApi.get(`/api/evaluations/attempt/${attemptId}`, getHeaders());
  return response.data;
};

// POST /api/evaluations/descriptive/{answerId}
export const evaluateDescriptiveAnswer = async (answerId, marksAwarded, remarks) => {
  const payload = {
    marksAwarded: parseFloat(marksAwarded),
    remarks: remarks || ''
  };
  const response = await authApi.post(`/api/evaluations/descriptive/${answerId}`, payload, getHeaders());
  return response.data;
};

// POST /api/evaluations/finalize/{attemptId}
export const finalizeAttempt = async (attemptId) => {
  const response = await authApi.post(`/api/evaluations/finalize/${attemptId}`, {}, getHeaders());
  return response.data;
};

// GET /api/results/student/{studentId}
export const getResultsByStudent = async (studentId) => {
  const response = await authApi.get(`/api/results/student/${studentId}`, getHeaders());
  return response.data;
};

// GET /api/results/test/{testId}
export const getResultsByTest = async (testId) => {
  const response = await authApi.get(`/api/results/test/${testId}`, getHeaders());
  return response.data;
};
