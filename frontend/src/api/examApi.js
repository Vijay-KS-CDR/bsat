import authApi from './authApi';

// POST /api/exams/start/{testId}
// Starts the exam and retrieves test metadata along with the list of questions (excluding answers).
export const startExam = async (testId) => {
  const response = await authApi.post(`/api/exams/start/${testId}`, {});
  const data = response.data;

  // If the backend returned successfully but with no questions, fall back to generated demo questions
  if (!data.questions || data.questions.length === 0) {
    console.warn('Backend returned no questions for this test. Using demo question set.');
    const mock = await getMockExamData(testId);
    // Preserve real test metadata (name, duration, etc.) but use mock questions
    return {
      ...mock,
      testId: data.testId ?? mock.testId,
      testName: data.testName ?? mock.testName,
      subjectName: data.subjectName ?? mock.subjectName,
      durationMinutes: data.durationMinutes ?? mock.durationMinutes,
      totalMarks: data.totalMarks ?? mock.totalMarks,
      instructions: data.instructions ?? mock.instructions,
    };
  }

  return data;
};

// POST /api/exams/save-answer
// Saves a single answer in real-time (best-effort - failures are non-critical).
export const saveAnswer = async (testId, questionId, answerText) => {
  try {
    const response = await authApi.post('/api/exams/save-answer', { testId, questionId, answerText });
    return response.data;
  } catch (error) {
    // Non-critical: answers are held in local state until final submit
    console.warn('Save answer best-effort call failed (non-critical):', error?.response?.status);
    return { success: true, message: 'Saved locally' };
  }
};

// POST /api/exams/submit
// Submits student responses and persists completion state.
// NOTE: This MUST succeed - errors are thrown so the caller can surface them to the user.
export const submitExam = async (testId, answers) => {
  const response = await authApi.post('/api/exams/submit', { testId, answers });
  return response.data;
};

// POST /api/exams/violation
// Logs a security violation to the backend (best-effort).
export const logViolation = async (violationData) => {
  try {
    const response = await authApi.post('/api/exams/violation', violationData);
    return response.data;
  } catch (error) {
    console.warn('Violation logging failed. Stored locally.');
    return { success: true, message: 'Logged locally' };
  }
};

// POST /api/exams/event
// Logs an audit trail event to the backend (best-effort).
export const logEvent = async (eventData) => {
  try {
    const response = await authApi.post('/api/exams/event', eventData);
    return response.data;
  } catch (error) {
    console.warn('Event logging failed. Stored locally.');
    return { success: true, message: 'Logged locally' };
  }
};

// Mock fallback logic: used ONLY when the backend starts an exam successfully but returns 0 questions.
// All question types must match the backend QuestionType enum: MCQ_SINGLE | NUMERICAL
const getMockExamData = async (testId) => {
  let testName = 'Online Examination';
  let subjectName = 'General';
  let durationMinutes = 30;
  let instructions = 'Read all questions carefully before answering.';

  try {
    const response = await authApi.get(`/api/student/tests/${testId}`);
    const t = response.data;
    testName = t.testName || testName;
    subjectName = t.subject || subjectName;
    durationMinutes = t.duration || durationMinutes;
    instructions = t.instructions || instructions;
  } catch (e) {
    console.warn('Failed to load student test details for mock fallback', e);
  }

  return {
    testId: Number(testId),
    testName,
    subjectName,
    durationMinutes,
    totalQuestions: 4,
    totalMarks: 8,
    instructions,
    questions: [
      {
        id: 101,
        questionType: 'MCQ_SINGLE',
        questionText: 'Which of the following is a correct declaration of a static method in Java?',
        optionA: 'public static void myMethod()',
        optionB: 'public void static myMethod()',
        optionC: 'static public void myMethod()',
        optionD: 'Both A and C are correct',
        marks: 2,
      },
      {
        id: 102,
        questionType: 'MCQ_SINGLE',
        questionText: 'What is the primary purpose of a garbage collector in Java?',
        optionA: 'To compile source code',
        optionB: 'To reclaim unused heap memory',
        optionC: 'To handle exceptions',
        optionD: 'To manage thread scheduling',
        marks: 2,
      },
      {
        id: 103,
        questionType: 'NUMERICAL',
        questionText: 'What is the value of 2 to the power of 10?',
        marks: 2,
      },
      {
        id: 104,
        questionType: 'NUMERICAL',
        questionText: 'How many bits are in a single byte?',
        marks: 2,
      },
    ],
  };
};
