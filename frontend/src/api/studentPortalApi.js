import authApi from './authApi';

// Helper to get headers
const getHeaders = () => {
  return { headers: {} };
};

// Helper to calculate grade from percentage
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

// GET /api/student/dashboard
export const getStudentDashboard = async () => {
  const response = await authApi.get('/api/student/dashboard', getHeaders());
  const b = response.data;
  return {
    student: {
      name: b.studentName || 'Student',
      id: localStorage.getItem('userId') || 'S-1042',
      rollNumber: 'N/A',
      class: b.className || '8',
      section: b.section || 'A',
      status: 'Active',
    },
    stats: {
      assignedTests: b.assignedTests || 0,
      completedTests: b.completedTests || 0,
      class: b.className || '8',
      section: b.section || 'A',
    },
  };
};

// GET /api/student/tests
export const getStudentTests = async () => {
  const response = await authApi.get('/api/student/tests', getHeaders());
  return (response.data || []).map((t) => ({
    id: t.testId,
    testName: t.testName,
    subject: t.subject,
    duration: t.duration,
    status: t.status,
  }));
};

// GET /api/student/tests/{id}
export const getStudentTestById = async (id) => {
  const response = await authApi.get(`/api/student/tests/${id}`, getHeaders());
  const t = response.data;
  return {
    id: t.testId,
    testName: t.testName,
    subject: t.subject,
    duration: t.duration,
    totalQuestions: t.totalQuestions,
    totalMarks: t.totalMarks,
    instructions: t.instructions,
    status: t.status,
  };
};

// GET /api/student/results
export const getStudentResults = async () => {
  const response = await authApi.get('/api/student/results', getHeaders());
  return (response.data || []).map((r) => ({
    id: r.testId,
    testId: r.testId,
    testName: r.testName,
    marksObtained: r.marksObtained,
    totalMarks: r.totalMarks,
    percentage: r.percentage,
    grade: calculateGrade(r.percentage),
  }));
};

// GET /api/student/results/{id}
export const getStudentResultById = async (id) => {
  const response = await authApi.get(`/api/student/results/${id}`, getHeaders());
  const r = response.data;
  return {
    attemptId: r.attemptId,
    testName: r.testName,
    marksObtained: r.marksObtained,
    totalMarks: r.totalMarks,
    percentage: r.percentage,
    correctAnswers: r.correctAnswers,
    wrongAnswers: r.wrongAnswers,
    grade: calculateGrade(r.percentage),
  };
};



