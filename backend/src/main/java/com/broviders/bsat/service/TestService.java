package com.broviders.bsat.service;

import com.broviders.bsat.dto.CreateTestRequest;
import com.broviders.bsat.dto.UpdateTestRequest;
import com.broviders.bsat.dto.TestResponse;
import java.util.List;

/**
 * Service interface for managing Assessment Tests.
 */
public interface TestService {

    List<TestResponse> getAllTests();

    TestResponse getTestById(Long id);

    TestResponse createTest(CreateTestRequest request);

    TestResponse updateTest(Long id, UpdateTestRequest request);

    void deleteTest(Long id);

    TestResponse publishTest(Long id);
}
