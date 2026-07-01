package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.entity.*;
import com.broviders.bsat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for student test submissions evaluation.
 * MCQ_SINGLE and NUMERICAL answers are evaluated and graded automatically.
 */
@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final StudentRepository studentRepository;
    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final EvaluationResultRepository evaluationResultRepository;

    @Override
    @Transactional
    public EvaluationResultResponse submitAttempt(Long testId, Long userId, Map<String, String> answers) {
        // 1. Resolve student and test
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with associated user ID: " + userId));

        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new IllegalArgumentException("Test not found with ID: " + testId));

        // Avoid duplicate attempt evaluation
        Optional<TestAttempt> existingAttempt = testAttemptRepository
                .findFirstByStudentIdAndTestIdAndStatus(student.getId(), testId, "SUBMITTED");
        if (existingAttempt.isPresent()) {
            throw new IllegalArgumentException("Test has already been submitted by this student!");
        }

        // 2. Create and save TestAttempt
        TestAttempt attempt = TestAttempt.builder()
                .student(student)
                .test(test)
                .startedAt(LocalDateTime.now().minusMinutes(test.getDurationMinutes()))
                .submittedAt(LocalDateTime.now())
                .status("SUBMITTED")
                .build();
        attempt = testAttemptRepository.save(attempt);

        // 3. Fetch questions assigned to the test
        List<TestQuestion> testQuestions = testQuestionRepository.findByTestId(testId);

        double totalMarks = 0;
        double obtainedMarks = 0;
        int correctAnswers = 0;
        int wrongAnswers = 0;

        // 4. Save and evaluate student answers
        for (TestQuestion tq : testQuestions) {
            Question q = tq.getQuestion();
            String studentAns = answers != null ? answers.get(String.valueOf(q.getId())) : null;

            Double marksAwarded = 0.0;
            Boolean isCorrect = false;
            String status = "EVALUATED";
            String remarks = "";

            totalMarks += q.getMarks();

            if (studentAns != null && !studentAns.trim().isEmpty()) {
                String correctAns = q.getCorrectAnswer();
                if (correctAns != null) {
                    if (q.getQuestionType() == QuestionType.MCQ_SINGLE) {
                        if (studentAns.trim().equalsIgnoreCase(correctAns.trim())) {
                            marksAwarded = (double) q.getMarks();
                            isCorrect = true;
                        }
                    } else if (q.getQuestionType() == QuestionType.NUMERICAL) {
                        boolean isNumericalMatch = false;
                        try {
                            isNumericalMatch = Double.valueOf(studentAns.trim())
                                    .equals(Double.valueOf(correctAns.trim()));
                        } catch (Exception e) {
                            isNumericalMatch = studentAns.trim().equalsIgnoreCase(correctAns.trim());
                        }
                        if (isNumericalMatch) {
                            marksAwarded = (double) q.getMarks();
                            isCorrect = true;
                        }
                    }
                }
            }

            if (isCorrect != null && isCorrect) {
                obtainedMarks += marksAwarded;
                correctAnswers++;
            } else if (isCorrect != null && !isCorrect) {
                wrongAnswers++;
            }

            StudentAnswer studentAnswer = StudentAnswer.builder()
                    .attempt(attempt)
                    .question(q)
                    .answerText(studentAns)
                    .marksAwarded(marksAwarded)
                    .isCorrect(isCorrect)
                    .remarks(remarks)
                    .status(status)
                    .build();
            studentAnswerRepository.save(studentAnswer);
        }

        // 5. Calculate percentage and status (graded automatically)
        double percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100.0 : 0.0;

        EvaluationResult result = EvaluationResult.builder()
                .attempt(attempt)
                .student(student)
                .test(test)
                .totalMarks(totalMarks)
                .obtainedMarks(obtainedMarks)
                .percentage(percentage)
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .status("COMPLETED")
                .evaluatedAt(LocalDateTime.now())
                .build();
        result = evaluationResultRepository.save(result);

        return mapResultToResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAnswerResponse> getEvaluationsByTest(Long testId) {
        return studentAnswerRepository.findAll().stream()
                .filter(ans -> ans.getAttempt().getTest().getId().equals(testId))
                .map(this::mapAnswerToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAnswerResponse> getEvaluationsByAttempt(Long attemptId) {
        return studentAnswerRepository.findByAttemptId(attemptId).stream()
                .map(this::mapAnswerToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvaluationResultResponse> getResultsByStudent(Long studentId) {
        return evaluationResultRepository.findByStudentId(studentId).stream()
                .map(this::mapResultToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EvaluationResultResponse> getResultsByTest(Long testId) {
        return evaluationResultRepository.findByTestId(testId).stream()
                .map(this::mapResultToResponse)
                .collect(Collectors.toList());
    }

    private StudentAnswerResponse mapAnswerToResponse(StudentAnswer ans) {
        return StudentAnswerResponse.builder()
                .id(ans.getId())
                .attemptId(ans.getAttempt().getId())
                .questionId(ans.getQuestion().getId())
                .questionText(ans.getQuestion().getQuestionText())
                .questionType(ans.getQuestion().getQuestionType().name())
                .studentName(ans.getAttempt().getStudent().getUser().getName())
                .testName(ans.getAttempt().getTest().getTestName())
                .studentAnswer(ans.getAnswerText())
                .correctAnswer(ans.getQuestion().getCorrectAnswer())
                .maxMarks(ans.getQuestion().getMarks())
                .marksAwarded(ans.getMarksAwarded())
                .isCorrect(ans.getIsCorrect())
                .remarks(ans.getRemarks())
                .status(ans.getStatus())
                .build();
    }

    private EvaluationResultResponse mapResultToResponse(EvaluationResult res) {
        List<StudentAnswer> answers = studentAnswerRepository.findByAttemptId(res.getAttempt().getId());
        java.util.Map<String, String> breakdown = new java.util.HashMap<>();

        java.util.Map<String, List<StudentAnswer>> answersBySubject = answers.stream()
                .collect(Collectors.groupingBy(ans -> ans.getQuestion().getSubject() != null ? ans.getQuestion().getSubject().getSubjectName() : "General"));

        for (java.util.Map.Entry<String, List<StudentAnswer>> entry : answersBySubject.entrySet()) {
            String subjectName = entry.getKey();
            List<StudentAnswer> subjectAnswers = entry.getValue();

            double subTotal = subjectAnswers.stream()
                    .mapToDouble(ans -> ans.getQuestion().getMarks())
                    .sum();
            double subObtained = subjectAnswers.stream()
                    .mapToDouble(ans -> ans.getMarksAwarded() != null ? ans.getMarksAwarded() : 0.0)
                    .sum();

            breakdown.put(subjectName, formatScore(subObtained, subTotal));
        }

        return EvaluationResultResponse.builder()
                .id(res.getId())
                .attemptId(res.getAttempt().getId())
                .studentId(res.getStudent().getId())
                .studentName(res.getStudent().getUser().getName())
                .testId(res.getTest().getId())
                .testName(res.getTest().getTestName())
                .subjectName(res.getTest().getSubject() != null ? res.getTest().getSubject().getSubjectName() : "General")
                .totalMarks(res.getTotalMarks())
                .obtainedMarks(res.getObtainedMarks())
                .percentage(res.getPercentage())
                .correctAnswers(res.getCorrectAnswers())
                .wrongAnswers(res.getWrongAnswers())
                .status(res.getStatus())
                .evaluatedAt(res.getEvaluatedAt())
                .subjectBreakdown(breakdown)
                .build();
    }

    private String formatScore(double obtained, double total) {
        if (obtained == (long) obtained && total == (long) total) {
            return String.format("%d/%d", (long) obtained, (long) total);
        }
        return String.format("%.1f/%.1f", obtained, total);
    }
}
