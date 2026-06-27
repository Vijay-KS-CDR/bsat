import authApi from './authApi';

// Convert backend StudentResponse to frontend student format
export const mapBackendToFrontend = (b) => {
  if (!b) return null;
  return {
    id: String(b.id),
    admissionNumber: b.admissionNumber || '',
    name: b.name || '',
    loginId: b.loginId || '',
    temporaryPassword: 'Password@123', // Backend doesn't return passwords
    class: b.className || '',
    section: b.section || '',
    gender: b.gender === 'MALE' ? 'Boy' : (b.gender === 'FEMALE' ? 'Girl' : 'Other'),
    dob: b.dateOfBirth || '',
    parentName: b.parentName || '',
    parentPhone: b.parentPhone || '',
    address: b.address || '',
    status: b.status === 'ACTIVE' ? 'Active' : 'Inactive',
    createdDate: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  };
};

// Convert frontend student format to backend CreateStudentRequest
export const mapFrontendToBackendCreate = (f) => {
  const cleanPhone = (f.parentPhone || '').replace(/\D/g, '').slice(-10);
  
  return {
    name: f.name,
    loginId: f.loginId,
    password: f.temporaryPassword || 'Password@123',
    admissionNumber: f.admissionNumber,
    className: f.class,
    section: f.section,
    gender: f.gender === 'Boy' ? 'MALE' : (f.gender === 'Girl' ? 'FEMALE' : 'OTHER'),
    dateOfBirth: f.dob,
    parentName: f.parentName,
    parentPhone: cleanPhone,
    address: f.address,
    status: f.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
  };
};

// Convert frontend student format to backend UpdateStudentRequest
export const mapFrontendToBackendUpdate = (f) => {
  const cleanPhone = (f.parentPhone || '').replace(/\D/g, '').slice(-10);

  return {
    name: f.name,
    className: f.class,
    section: f.section,
    gender: f.gender === 'Boy' ? 'MALE' : (f.gender === 'Girl' ? 'FEMALE' : 'OTHER'),
    dateOfBirth: f.dob,
    parentName: f.parentName,
    parentPhone: cleanPhone,
    address: f.address,
    status: f.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
  };
};

export const getStudents = async () => {
  const response = await authApi.get('/api/students');
  return (response.data?.students || []).map(mapBackendToFrontend);
};

export const getStudentById = async (id) => {
  const response = await authApi.get(`/api/students/${id}`);
  return mapBackendToFrontend(response.data);
};

export const createStudent = async (studentData) => {
  const payload = mapFrontendToBackendCreate(studentData);
  const response = await authApi.post('/api/students', payload);
  return mapBackendToFrontend(response.data);
};

export const updateStudent = async (id, studentData) => {
  const payload = mapFrontendToBackendUpdate(studentData);
  const response = await authApi.put(`/api/students/${id}`, payload);
  return mapBackendToFrontend(response.data);
};

export const deleteStudent = async (id) => {
  const response = await authApi.delete(`/api/students/${id}`);
  return response.data;
};

export const updateStudentStatus = async (id, status) => {
  const backendStatus = status === 'Active' ? 'ACTIVE' : 'INACTIVE';
  const response = await authApi.patch(`/api/students/${id}/status`, { status: backendStatus });
  return mapBackendToFrontend(response.data);
};
