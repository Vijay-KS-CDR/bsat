package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.entity.*;
import com.broviders.bsat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation managing direct test creation with inline questions.
 * Questions are created directly under the Test - no Question Bank dependency.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {

    private final TestRepository testRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final SubjectRepository subjectRepository;
    private final QuestionRepository questionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final EvaluationResultRepository evaluationResultRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TestResponse> getAllTests() {
        return testRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TestResponse getTestById(Long id) {
        Test test = findTestById(id);
        return mapToResponse(test);
    }

    @Override
    public TestResponse createTest(CreateTestRequest request) {
        // 1. Verify Subject exists
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Subject not found with ID: " + request.getSubjectId()));

        // 2. Validate scheduling: endTime must be after startTime
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be strictly after start time");
        }

        // 3. Compute totals from the inline question list
        int totalQuestions = request.getQuestions().size();
        int totalMarks = request.getQuestions().stream()
                .mapToInt(q -> q.getMarks() != null ? q.getMarks() : 1)
                .sum();

        // 4. Build and persist the Test entity (status defaults to DRAFT)
        Test test = Test.builder()
                .testName(request.getTestName())
                .className(request.getClassName())
                .section(request.getSection())
                .instructions(request.getInstructions())
                .subject(subject)
                .durationMinutes(request.getDurationMinutes())
                .totalQuestions(totalQuestions)
                .totalMarks(totalMarks)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(TestStatus.DRAFT)
                .build();

        Test savedTest = testRepository.save(test);

        // 5. Persist each inline question and link it via TestQuestion junction
        saveInlineQuestions(savedTest, subject, request.getQuestions());

        return mapToResponse(savedTest);
    }

    @Override
    public TestResponse updateTest(Long id, UpdateTestRequest request) {
        Test test = findTestById(id);

        // Business rule: only DRAFT tests can be edited
        if (test.getStatus() != TestStatus.DRAFT) {
            throw new IllegalArgumentException(
                    "Only DRAFT tests can be modified. This test is currently " + test.getStatus());
        }

        // Compute totals from updated question list
        int totalQuestions = request.getQuestions().size();
        int totalMarks = request.getQuestions().stream()
                .mapToInt(q -> q.getMarks() != null ? q.getMarks() : 1)
                .sum();

        // Update test fields
        test.setTestName(request.getTestName());
        test.setClassName(request.getClassName());
        test.setSection(request.getSection());
        test.setInstructions(request.getInstructions());
        test.setDurationMinutes(request.getDurationMinutes());
        test.setTotalQuestions(totalQuestions);
        test.setTotalMarks(totalMarks);

        Test savedTest = testRepository.save(test);

        // Delete old inline questions (orphan cleanup) and re-create from request
        deleteInlineQuestions(savedTest.getId());
        saveInlineQuestions(savedTest, savedTest.getSubject(), request.getQuestions());

        return mapToResponse(savedTest);
    }

    @Override
    public void deleteTest(Long id) {
        Test test = findTestById(id);

        // Business rule: only DRAFT and PUBLISHED tests can be deleted
        if (test.getStatus() != TestStatus.DRAFT && test.getStatus() != TestStatus.PUBLISHED) {
            throw new IllegalArgumentException(
                    "Only DRAFT and PUBLISHED tests can be deleted. This test is currently " + test.getStatus());
        }

        // Delete inline questions first, then the test
        deleteInlineQuestions(test.getId());
        testRepository.delete(test);
    }

    @Override
    public TestResponse publishTest(Long id) {
        Test test = findTestById(id);

        if (test.getStatus() == TestStatus.PUBLISHED) {
            throw new IllegalArgumentException("Test is already published");
        }
        if (test.getStatus() != TestStatus.DRAFT) {
            throw new IllegalArgumentException(
                    "Only DRAFT tests can be published. Current status: " + test.getStatus());
        }

        test.setStatus(TestStatus.PUBLISHED);
        return mapToResponse(testRepository.save(test));
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    private Test findTestById(Long id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Test not found with ID: " + id));
    }

    /**
     * Persists inline question objects from the request payload into the questions table
     * and links each to the test via a TestQuestion junction record.
     */
    private void saveInlineQuestions(Test test, Subject mainSubject, List<TestQuestionRequest> requests) {
        List<TestQuestion> junctions = new ArrayList<>();

        for (TestQuestionRequest qReq : requests) {
            Subject qSubject = mainSubject;
            if (qReq.getSubjectId() != null) {
                qSubject = subjectRepository.findById(qReq.getSubjectId())
                        .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + qReq.getSubjectId()));
            }

            // Build and save Question entity with defaults for Question Bank fields
            Question question = Question.builder()
                    .subject(qSubject)
                    .topic("Direct Entry")          // Default topic for inline questions
                    .questionType(qReq.getQuestionType())
                    .difficulty(Difficulty.MEDIUM)  // Default difficulty for inline questions
                    .questionText(qReq.getQuestionText())
                    .optionA(qReq.getOptionA())
                    .optionB(qReq.getOptionB())
                    .optionC(qReq.getOptionC())
                    .optionD(qReq.getOptionD())
                    .correctAnswer(qReq.getCorrectAnswer())
                    .marks(qReq.getMarks())
                    .status("Active")
                    .build();

            Question savedQuestion = questionRepository.save(question);

            junctions.add(TestQuestion.builder()
                    .test(test)
                    .question(savedQuestion)
                    .build());
        }

        testQuestionRepository.saveAll(junctions);
    }

    /**
     * Removes all junction entries for a test and deletes the associated inline questions
     * from the questions table to prevent database orphans.
     */
    private void deleteInlineQuestions(Long testId) {
        List<TestQuestion> junctions = testQuestionRepository.findByTestId(testId);

        // Collect question IDs before deleting junctions
        List<Long> questionIds = junctions.stream()
                .map(tq -> tq.getQuestion().getId())
                .collect(Collectors.toList());

        // Delete student answers, evaluation results, and attempts first (cascading cleanup)
        studentAnswerRepository.deleteByTestId(testId);
        evaluationResultRepository.deleteByTestId(testId);
        testAttemptRepository.deleteByTestId(testId);

        // Delete junction records (FK constraint)
        testQuestionRepository.deleteByTestId(testId);

        // Delete the orphaned inline questions
        if (!questionIds.isEmpty()) {
            questionRepository.deleteAllById(questionIds);
        }
    }

    /**
     * Maps a Test entity and its linked questions to the TestResponse DTO.
     */
    private TestResponse mapToResponse(Test test) {
        List<QuestionResponse> questionResponses = testQuestionRepository.findByTestId(test.getId())
                .stream()
                .map(tq -> mapQuestionToResponse(tq.getQuestion()))
                .collect(Collectors.toList());

        return TestResponse.builder()
                .id(test.getId())
                .testName(test.getTestName())
                .className(test.getClassName())
                .section(test.getSection())
                .instructions(test.getInstructions())
                .subjectId(test.getSubject().getId())
                .subjectName(test.getSubject().getSubjectName())
                .durationMinutes(test.getDurationMinutes())
                .totalMarks(test.getTotalMarks())
                .totalQuestions(test.getTotalQuestions())
                .startTime(test.getStartTime())
                .endTime(test.getEndTime())
                .status(test.getStatus())
                .createdAt(test.getCreatedAt())
                .updatedAt(test.getUpdatedAt())
                .questions(questionResponses)
                .build();
    }

    /**
     * Maps a Question entity to its response DTO.
     */
    private QuestionResponse mapQuestionToResponse(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .subjectId(q.getSubject().getId())
                .subjectName(q.getSubject().getSubjectName())
                .topic(q.getTopic())
                .questionType(q.getQuestionType())
                .difficulty(q.getDifficulty())
                .questionText(q.getQuestionText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .correctAnswer(q.getCorrectAnswer())
                .marks(q.getMarks())
                .status(q.getStatus())
                .build();
    }
}
