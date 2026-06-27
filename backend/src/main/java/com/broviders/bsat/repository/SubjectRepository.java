package com.broviders.bsat.repository;

import com.broviders.bsat.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing Subject entities in database.
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findBySubjectCode(String subjectCode);

    Optional<Subject> findBySubjectName(String subjectName);

    boolean existsBySubjectCode(String subjectCode);

    boolean existsBySubjectName(String subjectName);

    List<Subject> findByStatus(String status);
}
