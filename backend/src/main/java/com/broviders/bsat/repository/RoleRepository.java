package com.broviders.bsat.repository;

import com.broviders.bsat.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Role entity.
 * Provides data access operations on the 'roles' table.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    /**
     * Finds a role by its name (e.g., ADMIN, TEACHER, STUDENT).
     *
     * @param name the name of the role to search for
     * @return an Optional containing the found Role, or empty if not found
     */
    Optional<Role> findByName(String name);
}
