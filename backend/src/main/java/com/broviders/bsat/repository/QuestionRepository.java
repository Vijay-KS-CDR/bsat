package com.broviders.bsat.repository;

import com.broviders.bsat.entity.Question;
import com.broviders.bsat.entity.QuestionType;
import com.broviders.bsat.entity.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for managing Question entities in database.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySubjectId(Long subjectId);

    List<Question> findByQuestionType(QuestionType questionType);

    List<Question> findByDifficulty(Difficulty difficulty);

    List<Question> findByStatus(String status);
}
