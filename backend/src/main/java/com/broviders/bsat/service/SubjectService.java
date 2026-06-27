package com.broviders.bsat.service;

import com.broviders.bsat.dto.CreateSubjectRequest;
import com.broviders.bsat.dto.UpdateSubjectRequest;
import com.broviders.bsat.dto.SubjectResponse;

import java.util.List;

/**
 * Service interface defining academic Subject management actions.
 */
public interface SubjectService {

    List<SubjectResponse> getAllSubjects();

    SubjectResponse getSubjectById(Long id);

    SubjectResponse createSubject(CreateSubjectRequest request);

    SubjectResponse updateSubject(Long id, UpdateSubjectRequest request);

    void deleteSubject(Long id);

    SubjectResponse updateSubjectStatus(Long id, String status);
}
