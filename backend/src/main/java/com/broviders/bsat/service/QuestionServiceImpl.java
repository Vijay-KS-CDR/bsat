package com.broviders.bsat.service;

import com.broviders.bsat.dto.CreateQuestionRequest;
import com.broviders.bsat.dto.UpdateQuestionRequest;
import com.broviders.bsat.dto.QuestionResponse;
import com.broviders.bsat.entity.Question;
import com.broviders.bsat.entity.Subject;
import com.broviders.bsat.entity.QuestionType;
import com.broviders.bsat.entity.Difficulty;
import com.broviders.bsat.repository.QuestionRepository;
import com.broviders.bsat.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Question Bank actions.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(this::mapToListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + id));
        return mapToDetailedResponse(question);
    }

    @Override
    public QuestionResponse createQuestion(CreateQuestionRequest request) {
        // 1. Verify Subject exists
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + request.getSubjectId()));

        // 2. Perform conditional parameter validation
        validateQuestionDetails(request);

        // 3. Build entity
        Question question = Question.builder()
                .subject(subject)
                .topic(request.getTopic())
                .questionType(request.getQuestionType())
                .difficulty(request.getDifficulty())
                .questionText(request.getQuestionText())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer())
                .marks(request.getMarks())
                .status(request.getStatus().toUpperCase())
                .build();

        Question saved = questionRepository.save(question);
        return mapToDetailedResponse(saved);
    }

    @Override
    public QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + id));

        if (request.getTopic() != null) {
            if (request.getTopic().trim().length() < 3 || request.getTopic().trim().length() > 100) {
                throw new IllegalArgumentException("Topic must be between 3 and 100 characters");
            }
            question.setTopic(request.getTopic());
        }

        if (request.getDifficulty() != null) {
            question.setDifficulty(request.getDifficulty());
        }

        if (request.getMarks() != null) {
            if (request.getMarks() < 1 || request.getMarks() > 100) {
                throw new IllegalArgumentException("Marks must be between 1 and 100");
            }
            question.setMarks(request.getMarks());
        }

        if (request.getStatus() != null) {
            String upperStatus = request.getStatus().toUpperCase();
            if (!upperStatus.equals("ACTIVE") && !upperStatus.equals("INACTIVE")) {
                throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
            }
            question.setStatus(upperStatus);
        }

        if (request.getQuestionText() != null) {
            question.setQuestionText(request.getQuestionText());
        }
        if (request.getOptionA() != null) question.setOptionA(request.getOptionA());
        if (request.getOptionB() != null) question.setOptionB(request.getOptionB());
        if (request.getOptionC() != null) question.setOptionC(request.getOptionC());
        if (request.getOptionD() != null) question.setOptionD(request.getOptionD());
        if (request.getCorrectAnswer() != null) question.setCorrectAnswer(request.getCorrectAnswer());

        Question saved = questionRepository.save(question);
        return mapToDetailedResponse(saved);
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + id));
        questionRepository.delete(question);
    }

    @Override
    public QuestionResponse updateQuestionStatus(Long id, String status) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + id));

        String upperStatus = status.toUpperCase();
        if (!upperStatus.equals("ACTIVE") && !upperStatus.equals("INACTIVE")) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }

        question.setStatus(upperStatus);
        Question saved = questionRepository.save(question);
        return mapToDetailedResponse(saved);
    }

    /**
     * Programmatic conditional validations based on QuestionType rules.
     */
    private void validateQuestionDetails(CreateQuestionRequest request) {
        QuestionType type = request.getQuestionType();

        if (type == QuestionType.MCQ) {
            if (isBlank(request.getOptionA())) throw new IllegalArgumentException("Option A is required for MCQ");
            if (isBlank(request.getOptionB())) throw new IllegalArgumentException("Option B is required for MCQ");
            if (isBlank(request.getOptionC())) throw new IllegalArgumentException("Option C is required for MCQ");
            if (isBlank(request.getOptionD())) throw new IllegalArgumentException("Option D is required for MCQ");
            if (isBlank(request.getCorrectAnswer())) throw new IllegalArgumentException("Correct answer is required for MCQ");
            if (!request.getCorrectAnswer().toUpperCase().matches("^[A-D]$")) {
                throw new IllegalArgumentException("Correct answer must be A, B, C, or D");
            }
        } else if (type == QuestionType.ONE_WORD || type == QuestionType.NUMERICAL) {
            if (isBlank(request.getCorrectAnswer())) {
                throw new IllegalArgumentException("Correct answer is required");
            }
        }
        // DESCRIPTIVE types do not require a correct answer
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    /**
     * Maps to list response, hiding option columns and correct answers.
     */
    private QuestionResponse mapToListResponse(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .subjectId(q.getSubject().getId())
                .subjectName(q.getSubject().getSubjectName())
                .topic(q.getTopic())
                .questionType(q.getQuestionType())
                .difficulty(q.getDifficulty())
                .questionText(q.getQuestionText())
                .marks(q.getMarks())
                .status(q.getStatus())
                .build();
    }

    /**
     * Maps to full detailed response containing options and answer details.
     */
    private QuestionResponse mapToDetailedResponse(Question q) {
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
