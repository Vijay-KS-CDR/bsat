package com.broviders.bsat.service;

import com.broviders.bsat.dto.CreateSubjectRequest;
import com.broviders.bsat.dto.UpdateSubjectRequest;
import com.broviders.bsat.dto.SubjectResponse;
import com.broviders.bsat.entity.Subject;
import com.broviders.bsat.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for academic Subject entity actions.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + id));
        return mapToResponse(subject);
    }

    @Override
    public SubjectResponse createSubject(CreateSubjectRequest request) {
        // Enforce uniqueness constraints
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new IllegalArgumentException("Subject Code is already registered!");
        }
        if (subjectRepository.existsBySubjectName(request.getSubjectName())) {
            throw new IllegalArgumentException("Subject Name is already registered!");
        }

        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .description(request.getDescription())
                .status(request.getStatus().toUpperCase())
                .build();

        Subject saved = subjectRepository.save(subject);
        return mapToResponse(saved);
    }

    @Override
    public SubjectResponse updateSubject(Long id, UpdateSubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + id));

        // Enforce unique name constraint check if changing the subject name
        if (!subject.getSubjectName().equalsIgnoreCase(request.getSubjectName()) &&
                subjectRepository.existsBySubjectName(request.getSubjectName())) {
            throw new IllegalArgumentException("Subject Name is already registered!");
        }

        subject.setSubjectName(request.getSubjectName());
        subject.setDescription(request.getDescription());
        subject.setStatus(request.getStatus().toUpperCase());

        Subject saved = subjectRepository.save(subject);
        return mapToResponse(saved);
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + id));
        subjectRepository.delete(subject);
    }

    @Override
    public SubjectResponse updateSubjectStatus(Long id, String status) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + id));

        String upperStatus = status.toUpperCase();
        if (!upperStatus.equals("ACTIVE") && !upperStatus.equals("INACTIVE")) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }

        subject.setStatus(upperStatus);
        Subject saved = subjectRepository.save(subject);
        return mapToResponse(saved);
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .subjectName(subject.getSubjectName())
                .description(subject.getDescription())
                .status(subject.getStatus())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }
}
