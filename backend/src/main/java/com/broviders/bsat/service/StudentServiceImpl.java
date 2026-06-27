package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.entity.Role;
import com.broviders.bsat.entity.Student;
import com.broviders.bsat.entity.User;
import com.broviders.bsat.repository.RoleRepository;
import com.broviders.bsat.repository.StudentRepository;
import com.broviders.bsat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation containing transactional business operations for student management.
 */
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentResponse createStudent(CreateStudentRequest request) {
        // 1. Validate Admission Number uniqueness
        if (studentRepository.existsByAdmissionNumber(request.getAdmissionNumber())) {
            throw new IllegalArgumentException("Admission Number is already registered!");
        }

        // 2. Validate User Login ID uniqueness
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("Login ID is already registered!");
        }

        // 3. Retrieve student role from database
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalArgumentException("STUDENT role not found in the database."));

        // 4. Create and save associated User entity (with BCrypt password hashing)
        User user = User.builder()
                .name(request.getName())
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(studentRole)
                .build();
        User savedUser = userRepository.save(user);

        // 5. Create and save Student entity
        Student student = Student.builder()
                .user(savedUser)
                .admissionNumber(request.getAdmissionNumber())
                .className(request.getClassName())
                .section(request.getSection())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .parentName(request.getParentName())
                .parentPhone(request.getParentPhone())
                .address(request.getAddress())
                .status(request.getStatus())
                .build();
        Student savedStudent = studentRepository.save(student);

        return mapToResponse(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
        return mapToResponse(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));

        // Update User name associated with student
        User user = student.getUser();
        user.setName(request.getName());
        userRepository.save(user);

        // Update Student fields
        student.setClassName(request.getClassName());
        student.setSection(request.getSection());
        student.setGender(request.getGender());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setParentName(request.getParentName());
        student.setParentPhone(request.getParentPhone());
        student.setAddress(request.getAddress());
        student.setStatus(request.getStatus());

        Student updatedStudent = studentRepository.save(student);
        return mapToResponse(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
        
        // Deleting the student entity first, then the associated user entity to ensure explicit database cleanup
        User user = student.getUser();
        studentRepository.delete(student);
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public StudentResponse updateStudentStatus(Long id, String status) {
        if (status == null || (!status.equals("ACTIVE") && !status.equals("INACTIVE"))) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));

        student.setStatus(status);
        Student updatedStudent = studentRepository.save(student);
        return mapToResponse(updatedStudent);
    }

    /**
     * Map a Student entity to a flattened StudentResponse DTO.
     */
    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .name(student.getUser().getName())
                .loginId(student.getUser().getLoginId())
                .role(student.getUser().getRole().getName())
                .admissionNumber(student.getAdmissionNumber())
                .className(student.getClassName())
                .section(student.getSection())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .parentName(student.getParentName())
                .parentPhone(student.getParentPhone())
                .address(student.getAddress())
                .status(student.getStatus())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
