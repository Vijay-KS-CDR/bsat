package com.broviders.bsat.repository;

import com.broviders.bsat.entity.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for managing TestQuestion junction entities.
 */
@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {

    List<TestQuestion> findByTestId(Long testId);

    void deleteByTestId(Long testId);
}
