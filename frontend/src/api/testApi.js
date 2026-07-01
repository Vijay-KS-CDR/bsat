import authApi from './authApi';

// GET /api/tests
export const getTests = async () => {
  const response = await authApi.get('/api/tests');
  // Backend returns TestListResponse: { tests: [...] }
  return response.data?.tests || response.data || [];
};

// GET /api/tests/{id}
export const getTestById = async (id) => {
  const response = await authApi.get(`/api/tests/${id}`);
  return response.data?.data || response.data;
};

// POST /api/tests
export const createTest = async (testData) => {
  const response = await authApi.post('/api/tests', testData);
  return response.data?.data || response.data;
};

// PUT /api/tests/{id}
export const updateTest = async (id, testData) => {
  const response = await authApi.put(`/api/tests/${id}`, testData);
  return response.data?.data || response.data;
};

// DELETE /api/tests/{id}
export const deleteTest = async (id) => {
  const response = await authApi.delete(`/api/tests/${id}`);
  return response.data;
};

// PATCH /api/tests/{id}/publish
export const publishTest = async (id) => {
  const response = await authApi.patch(`/api/tests/${id}/publish`);
  return response.data?.data || response.data;
};
