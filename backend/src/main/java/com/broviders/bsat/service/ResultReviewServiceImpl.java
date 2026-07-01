package com.broviders.bsat.service;

import com.broviders.bsat.dto.AnswerReviewResponse;
import com.broviders.bsat.dto.QuestionReviewResponse;
import com.broviders.bsat.entity.*;
import com.broviders.bsat.exception.AccessDeniedException;
import com.broviders.bsat.exception.ResourceNotFoundException;
import com.broviders.bsat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service implementation containing transactional business operations for detailed exam review.
 */
@Service
@RequiredArgsConstructor
public class ResultReviewServiceImpl implements ResultReviewService {

    private final TestAttemptRepository testAttemptRepository;
    private final EvaluationResultRepository evaluationResultRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    public AnswerReviewResponse getAnswerReview(Long attemptId, Long currentUserId) {
        // 1. Load Attempt
        TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Test attempt not found with ID: " + attemptId));

        // 2. Load Evaluation Result to get summary details & verify completion
        EvaluationResult evaluationResult = evaluationResultRepository.findByAttemptId(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation results not found for attempt ID: " + attemptId));

        // Enforce completed attempt business rule
        if (!"COMPLETED".equalsIgnoreCase(evaluationResult.getStatus())) {
            throw new IllegalArgumentException("Review is available only for completed attempts.");
        }

        // 3. Enforce Security rules
        final Long finalUserId = (currentUserId != null) ? currentUserId : 2L;
        User currentUser = userRepository.findById(finalUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + finalUserId));

        String roleName = currentUser.getRole().getName().toUpperCase();
        if ("STUDENT".equals(roleName)) {
            // Find student profile associated with the current user ID
            Student student = studentRepository.findByUserId(finalUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + finalUserId));
            
            // Check if attempt belongs to this student
            if (!attempt.getStudent().getId().equals(student.getId())) {
                throw new AccessDeniedException("Access Denied: You cannot view another student's exam review.");
            }
        } else if (!"TEACHER".equals(roleName) && !"ADMIN".equals(roleName)) {
            throw new AccessDeniedException("Access Denied: Invalid role permissions.");
        }

        // 4. Load Student Answers (fetch all at once to avoid N+1 query problem)
        List<StudentAnswer> studentAnswers = studentAnswerRepository.findByAttemptId(attemptId);
        Map<Long, StudentAnswer> answerMap = studentAnswers.stream()
                .collect(Collectors.toMap(ans -> ans.getQuestion().getId(), ans -> ans, (a, b) -> a));

        // 5. Load Test and Questions (to map in original sequence order)
        Test test = attempt.getTest();
        List<TestQuestion> testQuestions = testQuestionRepository.findByTestId(test.getId());

        int questionIndex = 1;
        List<QuestionReviewResponse> questionReviews = new ArrayList<>();

        for (TestQuestion tq : testQuestions) {
            Question q = tq.getQuestion();
            StudentAnswer ans = answerMap.get(q.getId());

            String studentAnswerText = (ans != null) ? ans.getAnswerText() : null;
            Double marks = (ans != null && ans.getMarksAwarded() != null) ? ans.getMarksAwarded() : 0.0;
            Boolean isCorrect = (ans != null) ? ans.getIsCorrect() : null;

            // Map correctness status values exactly as specified: CORRECT, WRONG, SKIPPED
            String status = "SKIPPED";
            if (studentAnswerText != null && !studentAnswerText.trim().isEmpty()) {
                if (Boolean.TRUE.equals(isCorrect) || (marks > 0)) {
                    status = "CORRECT";
                } else {
                    status = "WRONG";
                }
            }

            // Map options if question is MCQ_SINGLE
            List<String> options = null;
            if (q.getQuestionType() != null && "MCQ_SINGLE".equalsIgnoreCase(q.getQuestionType().name())) {
                options = new ArrayList<>();
                if (q.getOptionA() != null) options.add(q.getOptionA());
                if (q.getOptionB() != null) options.add(q.getOptionB());
                if (q.getOptionC() != null) options.add(q.getOptionC());
                if (q.getOptionD() != null) options.add(q.getOptionD());
            }

            QuestionReviewResponse qr = QuestionReviewResponse.builder()
                    .questionId(q.getId())
                    .questionNumber(questionIndex++)
                    .questionText(q.getQuestionText())
                    .questionType(q.getQuestionType() != null ? q.getQuestionType().name() : "MCQ_SINGLE")
                    .studentAnswer(studentAnswerText)
                    .correctAnswer(q.getCorrectAnswer())
                    .marksAwarded(marks)
                    .status(status)
                    .options(options)
                    .build();

            questionReviews.add(qr);
        }

        // 6. Build and return response DTO
        return AnswerReviewResponse.builder()
                .attemptId(attemptId)
                .testName(test.getTestName())
                .subject(test.getSubject() != null ? test.getSubject().getSubjectName() : "General")
                .totalMarks((int) Math.round(evaluationResult.getTotalMarks()))
                .obtainedMarks((int) Math.round(evaluationResult.getObtainedMarks()))
                .percentage((int) Math.round(evaluationResult.getPercentage()))
                .correctAnswers(evaluationResult.getCorrectAnswers())
                .wrongAnswers(evaluationResult.getWrongAnswers())
                .submittedAt(attempt.getSubmittedAt())
                .questions(questionReviews)
                .build();
    }
}
