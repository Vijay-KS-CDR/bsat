import authApi from './authApi';

// Convert backend response format to frontend format
export const mapBackendToFrontend = (b) => {
  if (!b) return null;
  return {
    id: String(b.id),
    subjectCode: b.subjectCode || '',
    name: b.subjectName || '', // Backend is subjectName, frontend is name
    description: b.description || '',
    status: b.status === 'ACTIVE' ? 'Active' : 'Inactive',
    createdDate: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
  };
};

// Convert frontend format to backend create format (CreateSubjectRequest)
export const mapFrontendToBackendCreate = (f) => {
  return {
    subjectCode: f.subjectCode,
    subjectName: f.name, // Frontend name -> backend subjectName
    description: f.description,
    status: f.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
  };
};

// Convert frontend format to backend update format (UpdateSubjectRequest)
export const mapFrontendToBackendUpdate = (f) => {
  return {
    subjectName: f.name, // Frontend name -> backend subjectName
    description: f.description,
    status: f.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
  };
};

// 1. Fetch all subjects
export const getSubjects = async () => {
  const response = await authApi.get('/api/subjects');
  return (response.data?.subjects || []).map(mapBackendToFrontend);
};

// 2. Fetch a subject by ID
export const getSubjectById = async (id) => {
  const response = await authApi.get(`/api/subjects/${id}`);
  return mapBackendToFrontend(response.data);
};

// 3. Create a new subject
export const createSubject = async (subjectData) => {
  const payload = mapFrontendToBackendCreate(subjectData);
  const response = await authApi.post('/api/subjects', payload);
  return mapBackendToFrontend(response.data);
};

// 4. Update an existing subject
export const updateSubject = async (id, subjectData) => {
  const payload = mapFrontendToBackendUpdate(subjectData);
  const response = await authApi.put(`/api/subjects/${id}`, payload);
  return mapBackendToFrontend(response.data);
};

// 5. Delete a subject
export const deleteSubject = async (id) => {
  const response = await authApi.delete(`/api/subjects/${id}`);
  return response.data;
};

// 6. Toggle/update subject status (PATCH status)
export const updateSubjectStatus = async (id, status) => {
  const backendStatus = status === 'Active' || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  const response = await authApi.patch(`/api/subjects/${id}/status`, { status: backendStatus });
  return mapBackendToFrontend(response.data);
};
