package com.broviders.bsat.repository;

import com.broviders.bsat.entity.Test;
import com.broviders.bsat.entity.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for managing Test entities in the database.
 */
@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

    List<Test> findByStatus(TestStatus status);

    List<Test> findBySubjectId(Long subjectId);
}
