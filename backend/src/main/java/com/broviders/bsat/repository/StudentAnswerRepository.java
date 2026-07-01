package com.broviders.bsat.repository;

import com.broviders.bsat.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByAttemptId(Long attemptId);
    List<StudentAnswer> findByAttemptIdAndStatus(Long attemptId, String status);
    List<StudentAnswer> findByStatus(String status);

    @Modifying
    @Query("DELETE FROM StudentAnswer sa WHERE sa.attempt.test.id = :testId")
    void deleteByTestId(@Param("testId") Long testId);
}
