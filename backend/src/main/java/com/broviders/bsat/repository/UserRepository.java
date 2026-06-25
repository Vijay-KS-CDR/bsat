package com.broviders.bsat.repository;

import com.broviders.bsat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides data access operations on the 'users' table.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their login ID.
     * This is used during the login process to verify user credentials.
     *
     * @param loginId the login ID to search for
     * @return an Optional containing the found User, or empty if not found
     */
    Optional<User> findByLoginId(String loginId);

    /**
     * Checks if a user already exists with the given login ID.
     * This is used during registration to enforce unique login IDs.
     *
     * @param loginId the login ID to check
     * @return true if a user exists with the login ID, false otherwise
     */
    boolean existsByLoginId(String loginId);
}
