import authApi from './authApi';

// Convert backend response format to frontend format
export const mapBackendToFrontend = (b) => {
  if (!b) return null;

  let diff = 'Medium';
  if (b.difficulty === 'EASY' || b.difficulty === 'Easy') diff = 'Easy';
  else if (b.difficulty === 'HARD' || b.difficulty === 'Hard') diff = 'Hard';
  else if (b.difficulty === 'MEDIUM' || b.difficulty === 'Medium') diff = 'Medium';

  return {
    id: String(b.id),
    subjectId: Number(b.subjectId || 1),
    subject: b.subjectName || b.subject || '',
    topic: b.topic || '',
    questionType: b.questionType || 'MCQ_SINGLE',
    difficulty: diff,
    questionText: b.questionText || '',
    options: {
      A: b.optionA || '',
      B: b.optionB || '',
      C: b.optionC || '',
      D: b.optionD || ''
    },
    correctAnswer: b.correctAnswer || '',
    marks: Number(b.marks || 1),
    status: b.status === 'ACTIVE' ? 'Active' : 'Inactive',
    createdDate: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
  };
};

// Convert frontend format to backend create format (CreateQuestionRequest)
export const mapFrontendToBackendCreate = (f) => {
  const isMcq = f.questionType === 'MCQ_SINGLE';
  return {
    subjectId: Number(f.subjectId || 1),
    topic: f.topic || '',
    questionType: f.questionType || 'MCQ_SINGLE',
    difficulty: f.difficulty ? f.difficulty.toUpperCase() : 'MEDIUM',
    questionText: f.questionText || '',
    optionA: isMcq ? (f.options?.A || f.optionA || '') : null,
    optionB: isMcq ? (f.options?.B || f.optionB || '') : null,
    optionC: isMcq ? (f.options?.C || f.optionC || '') : null,
    optionD: isMcq ? (f.options?.D || f.optionD || '') : null,
    correctAnswer: f.correctAnswer || '',
    marks: Number(f.marks || 1),
    status: f.status === 'Active' || f.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
  };
};

// Convert frontend format to backend update format (UpdateQuestionRequest)
export const mapFrontendToBackendUpdate = (f) => {
  const isMcq = f.questionType === 'MCQ_SINGLE';
  return {
    topic: f.topic || '',
    difficulty: f.difficulty ? f.difficulty.toUpperCase() : 'MEDIUM',
    marks: Number(f.marks || 1),
    status: f.status === 'Active' || f.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
    questionText: f.questionText || '',
    optionA: isMcq ? (f.options?.A || f.optionA || '') : null,
    optionB: isMcq ? (f.options?.B || f.optionB || '') : null,
    optionC: isMcq ? (f.options?.C || f.optionC || '') : null,
    optionD: isMcq ? (f.options?.D || f.optionD || '') : null,
    correctAnswer: f.correctAnswer || ''
  };
};

// 1. Fetch all questions
export const getAllQuestions = async () => {
  const response = await authApi.get('/api/questions');
  const list = response.data?.data || response.data || [];
  return Array.isArray(list) ? list.map(mapBackendToFrontend) : [];
};

export const getQuestions = getAllQuestions;

// 2. Fetch a question by ID
export const getQuestionById = async (id) => {
  const response = await authApi.get(`/api/questions/${id}`);
  const item = response.data?.data || response.data;
  return mapBackendToFrontend(item);
};

// 3. Create a new question
export const createQuestion = async (questionData) => {
  const payload = mapFrontendToBackendCreate(questionData);
  const response = await authApi.post('/api/questions', payload);
  const item = response.data?.data || response.data;
  return mapBackendToFrontend(item);
};

// 4. Update an existing question
export const updateQuestion = async (id, questionData) => {
  const payload = mapFrontendToBackendUpdate(questionData);
  const response = await authApi.put(`/api/questions/${id}`, payload);
  const item = response.data?.data || response.data;
  return mapBackendToFrontend(item);
};

// 5. Delete a question
export const deleteQuestion = async (id) => {
  const response = await authApi.delete(`/api/questions/${id}`);
  return response.data;
};

// 6. Update question status
export const updateQuestionStatus = async (id, status) => {
  const backendStatus = status === 'Active' || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
  const response = await authApi.patch(`/api/questions/${id}/status`, { status: backendStatus });
  const item = response.data?.data || response.data;
  return mapBackendToFrontend(item);
};
