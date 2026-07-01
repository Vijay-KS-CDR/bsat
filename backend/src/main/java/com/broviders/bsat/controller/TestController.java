package com.broviders.bsat.controller;

import com.broviders.bsat.dto.CreateTestRequest;
import com.broviders.bsat.dto.UpdateTestRequest;
import com.broviders.bsat.dto.TestResponse;
import com.broviders.bsat.dto.TestListResponse;
import com.broviders.bsat.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST Controller exposing endpoints for Test creation and scheduling.
 */
@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping
    public ResponseEntity<?> createTest(@Valid @RequestBody CreateTestRequest request) {
        try {
            TestResponse response = testService.createTest(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTestById(@PathVariable Long id) {
        try {
            TestResponse response = testService.getTestById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<TestListResponse> getAllTests() {
        List<TestResponse> tests = testService.getAllTests();
        TestListResponse response = TestListResponse.builder()
                .tests(tests)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTest(@PathVariable Long id, @Valid @RequestBody UpdateTestRequest request) {
        try {
            TestResponse response = testService.updateTest(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTest(@PathVariable Long id) {
        try {
            testService.deleteTest(id);
            return ResponseEntity.ok(Map.of("message", "Test deleted successfully", "success", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<?> publishTest(@PathVariable Long id) {
        try {
            TestResponse response = testService.publishTest(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
