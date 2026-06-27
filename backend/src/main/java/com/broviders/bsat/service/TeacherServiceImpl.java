package com.broviders.bsat.service;

import com.broviders.bsat.dto.*;
import com.broviders.bsat.entity.Role;
import com.broviders.bsat.entity.Teacher;
import com.broviders.bsat.entity.User;
import com.broviders.bsat.repository.RoleRepository;
import com.broviders.bsat.repository.TeacherRepository;
import com.broviders.bsat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation containing transactional business operations for teacher management.
 */
@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public TeacherResponse createTeacher(CreateTeacherRequest request) {
        // 1. Validate Employee ID uniqueness
        if (teacherRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID is already registered!");
        }

        // 2. Validate User Login ID uniqueness
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("Login ID is already registered!");
        }

        // 3. Retrieve teacher role from database
        Role teacherRole = roleRepository.findByName("TEACHER")
                .orElseThrow(() -> new IllegalArgumentException("TEACHER role not found in the database."));

        // 4. Create and save associated User entity (with BCrypt password hashing)
        User user = User.builder()
                .name(request.getName())
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(teacherRole)
                .build();
        User savedUser = userRepository.save(user);

        // 5. Create and save Teacher entity
        Teacher teacher = Teacher.builder()
                .user(savedUser)
                .employeeId(request.getEmployeeId())
                .phone(request.getPhone())
                .qualification(request.getQualification())
                .experience(request.getExperience())
                .address(request.getAddress())
                .status(request.getStatus())
                .build();
        Teacher savedTeacher = teacherRepository.save(teacher);

        return mapToResponse(savedTeacher);
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with ID: " + id));
        return mapToResponse(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TeacherResponse updateTeacher(Long id, UpdateTeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with ID: " + id));

        // Update User name associated with teacher
        User user = teacher.getUser();
        user.setName(request.getName());
        userRepository.save(user);

        // Update Teacher fields
        teacher.setPhone(request.getPhone());
        teacher.setQualification(request.getQualification());
        teacher.setExperience(request.getExperience());
        teacher.setAddress(request.getAddress());
        teacher.setStatus(request.getStatus());

        Teacher updatedTeacher = teacherRepository.save(teacher);
        return mapToResponse(updatedTeacher);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with ID: " + id));

        // Deleting the teacher entity first, then the associated user entity to ensure explicit database cleanup
        User user = teacher.getUser();
        teacherRepository.delete(teacher);
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public TeacherResponse updateTeacherStatus(Long id, String status) {
        if (status == null || (!status.equals("ACTIVE") && !status.equals("INACTIVE"))) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found with ID: " + id));

        teacher.setStatus(status);
        Teacher updatedTeacher = teacherRepository.save(teacher);
        return mapToResponse(updatedTeacher);
    }

    /**
     * Map a Teacher entity to a flattened TeacherResponse DTO.
     */
    private TeacherResponse mapToResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .userId(teacher.getUser().getId())
                .name(teacher.getUser().getName())
                .loginId(teacher.getUser().getLoginId())
                .role(teacher.getUser().getRole().getName())
                .employeeId(teacher.getEmployeeId())
                .phone(teacher.getPhone())
                .qualification(teacher.getQualification())
                .experience(teacher.getExperience())
                .address(teacher.getAddress())
                .status(teacher.getStatus())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }
}
