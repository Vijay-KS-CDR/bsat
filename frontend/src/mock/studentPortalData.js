// ============================================================
// Student Portal Mock Data — Class 8A
// Future: replace mock returns with real axios calls to:
//   GET /api/student/dashboard
//   GET /api/student/tests
//   GET /api/student/tests/{id}
//   GET /api/student/results
//   GET /api/student/results/{id}
// ============================================================

export const MOCK_STUDENT = {
  id: 'S-1042',
  name: 'Arjun Mehta',
  loginId: 'STU-8A-042',
  class: '8',
  section: 'A',
  rollNumber: '42',
  email: 'arjun.mehta@bsat.edu',
  parentPhone: '9876543210',
  gender: 'Boy',
  status: 'Active',
};

export const MOCK_TESTS = [
  {
    id: 't-001',
    testName: 'Mathematics Mid-Term Examination',
    subject: 'Mathematics',
    duration: 90,
    totalQuestions: 30,
    totalMarks: 60,
    status: 'ASSIGNED',
    assignedDate: '2024-06-20',
    dueDate: '2024-07-05',
    instructions:
      'This test contains 30 questions. All questions are compulsory. Each correct answer carries 2 marks. No negative marking. You must complete the test in one sitting. Ensure you have a stable internet connection before starting.',
  },
  {
    id: 't-002',
    testName: 'Science Chapter 5 – Force and Motion',
    subject: 'Science',
    duration: 45,
    totalQuestions: 20,
    totalMarks: 40,
    status: 'COMPLETED',
    assignedDate: '2024-06-10',
    dueDate: '2024-06-15',
    completedDate: '2024-06-14',
    instructions:
      'This test contains 20 MCQ questions. Each correct answer carries 2 marks. No negative marking. Read each question carefully before answering.',
  },
  {
    id: 't-003',
    testName: 'English Grammar & Comprehension Test',
    subject: 'English',
    duration: 60,
    totalQuestions: 25,
    totalMarks: 50,
    status: 'ASSIGNED',
    assignedDate: '2024-06-22',
    dueDate: '2024-07-10',
    instructions:
      'The test is divided into two parts: Grammar (15 questions) and Comprehension (10 questions). All questions carry equal marks. No negative marking. Time yourself carefully.',
  },
  {
    id: 't-004',
    testName: 'Social Science – History Unit Test',
    subject: 'Social Science',
    duration: 45,
    totalQuestions: 20,
    totalMarks: 40,
    status: 'COMPLETED',
    assignedDate: '2024-06-01',
    dueDate: '2024-06-08',
    completedDate: '2024-06-07',
    instructions:
      'This test covers Chapter 1 and Chapter 2 of the History textbook. All 20 questions are compulsory. Each question carries 2 marks.',
  },
  {
    id: 't-005',
    testName: 'Mathematics – Algebra Practice Test',
    subject: 'Mathematics',
    duration: 30,
    totalQuestions: 15,
    totalMarks: 30,
    status: 'COMPLETED',
    assignedDate: '2024-05-20',
    dueDate: '2024-05-25',
    completedDate: '2024-05-24',
    instructions:
      'This practice test covers algebraic expressions and equations. 15 questions, 2 marks each. Complete within the time limit.',
  },
  {
    id: 't-006',
    testName: 'Science – Chemical Reactions Quiz',
    subject: 'Science',
    duration: 30,
    totalQuestions: 15,
    totalMarks: 30,
    status: 'ASSIGNED',
    assignedDate: '2024-06-25',
    dueDate: '2024-07-12',
    instructions:
      'Quick quiz on chemical reactions and their types. 15 questions, 2 marks each. Attempt all questions within the allotted time.',
  },
];

export const MOCK_RESULTS = [
  {
    id: 'r-001',
    testId: 't-002',
    testName: 'Science Chapter 5 – Force and Motion',
    subject: 'Science',
    marksObtained: 34,
    totalMarks: 40,
    percentage: 85,
    correctAnswers: 17,
    wrongAnswers: 3,
    unattempted: 0,
    completedDate: '2024-06-14',
    timeTaken: 38,
    grade: 'A',
  },
  {
    id: 'r-002',
    testId: 't-004',
    testName: 'Social Science – History Unit Test',
    subject: 'Social Science',
    marksObtained: 30,
    totalMarks: 40,
    percentage: 75,
    correctAnswers: 15,
    wrongAnswers: 5,
    unattempted: 0,
    completedDate: '2024-06-07',
    timeTaken: 42,
    grade: 'B+',
  },
  {
    id: 'r-003',
    testId: 't-005',
    testName: 'Mathematics – Algebra Practice Test',
    subject: 'Mathematics',
    marksObtained: 26,
    totalMarks: 30,
    percentage: 86.67,
    correctAnswers: 13,
    wrongAnswers: 2,
    unattempted: 0,
    completedDate: '2024-05-24',
    timeTaken: 27,
    grade: 'A',
  },
];

export const MOCK_DASHBOARD_STATS = {
  assignedTests: MOCK_TESTS.filter((t) => t.status === 'ASSIGNED').length,
  completedTests: MOCK_TESTS.filter((t) => t.status === 'COMPLETED').length,
  class: MOCK_STUDENT.class,
  section: MOCK_STUDENT.section,
};
