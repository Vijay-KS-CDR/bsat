package com.broviders.bsat.repository;

import com.broviders.bsat.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByStudentId(Long studentId);
    List<TestAttempt> findByTestId(Long testId);
    Optional<TestAttempt> findFirstByStudentIdAndTestIdAndStatus(Long studentId, Long testId, String status);

    @Modifying
    @Query("DELETE FROM TestAttempt ta WHERE ta.test.id = :testId")
    void deleteByTestId(@Param("testId") Long testId);
}
