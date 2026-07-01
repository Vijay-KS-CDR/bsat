package com.broviders.bsat.repository;

import com.broviders.bsat.entity.EvaluationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationResultRepository extends JpaRepository<EvaluationResult, Long> {
    List<EvaluationResult> findByStudentId(Long studentId);
    List<EvaluationResult> findByTestId(Long testId);
    Optional<EvaluationResult> findByAttemptId(Long attemptId);

    @Modifying
    @Query("DELETE FROM EvaluationResult er WHERE er.test.id = :testId")
    void deleteByTestId(@Param("testId") Long testId);
}
