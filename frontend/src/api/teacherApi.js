import authApi from './authApi';

// Convert backend response format to frontend format (for matching keys)
export const mapBackendToFrontend = (b) => {
  if (!b) return null;
  return {
    id: String(b.id),
    employeeId: b.employeeId || '',
    name: b.name || '',
    loginId: b.loginId || '',
    temporaryPassword: 'Password@123', // Backend doesn't return passwords
    phone: b.phone || '',
    qualification: b.qualification || '',
    experience: Number(b.experience) || 0,
    address: b.address || '',
    status: b.status === 'ACTIVE' ? 'Active' : 'Inactive',
    createdDate: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  };
};

// Convert frontend format to backend create format (CreateTeacherRequest)
export const mapFrontendToBackendCreate = (f) => {
  const cleanPhone = (f.phone || '').replace(/\D/g, '').slice(-10);
  return {
    name: f.name,
    employeeId: f.employeeId,
    loginId: f.loginId,
    password: f.temporaryPassword || 'Password@123',
    phone: cleanPhone,
    qualification: f.qualification,
    experience: Number(f.experience),
    address: f.address,
    status: f.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
  };
};

// Convert frontend format to backend update format (UpdateTeacherRequest)
export const mapFrontendToBackendUpdate = (f) => {
  const cleanPhone = (f.phone || '').replace(/\D/g, '').slice(-10);
  return {
    name: f.name,
    phone: cleanPhone,
    qualification: f.qualification,
    experience: Number(f.experience),
    address: f.address,
    status: f.status === 'Active' ? 'ACTIVE' : 'INACTIVE'
  };
};

// 1. Fetch all teachers
export const getTeachers = async () => {
  const response = await authApi.get('/api/teachers');
  return (response.data?.teachers || []).map(mapBackendToFrontend);
};

// 2. Fetch a teacher by ID
export const getTeacherById = async (id) => {
  const response = await authApi.get(`/api/teachers/${id}`);
  return mapBackendToFrontend(response.data);
};

// 3. Create a new teacher
export const createTeacher = async (teacherData) => {
  const payload = mapFrontendToBackendCreate(teacherData);
  const response = await authApi.post('/api/teachers', payload);
  return mapBackendToFrontend(response.data);
};

// 4. Update an existing teacher
export const updateTeacher = async (id, teacherData) => {
  const payload = mapFrontendToBackendUpdate(teacherData);
  const response = await authApi.put(`/api/teachers/${id}`, payload);
  return mapBackendToFrontend(response.data);
};

// 5. Delete a teacher
export const deleteTeacher = async (id) => {
  const response = await authApi.delete(`/api/teachers/${id}`);
  return response.data;
};

// 6. Toggle/update teacher status (PATCH status)
export const updateTeacherStatus = async (id, status) => {
  const backendStatus = status === 'Active' || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  const response = await authApi.patch(`/api/teachers/${id}/status`, { status: backendStatus });
  return mapBackendToFrontend(response.data);
};
