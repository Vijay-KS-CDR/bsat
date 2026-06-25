package com.broviders.bsat.config;

import com.broviders.bsat.entity.Role;
import com.broviders.bsat.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Component that runs automatically after the application starts.
 * Seeds the roles table with default values (ADMIN, TEACHER, STUDENT) if they do not exist.
 */
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    /**
     * Callback method executed on application startup.
     * Starts the role seeding process.
     *
     * @param args incoming command line arguments
     * @throws Exception if any database operation fails
     */
    @Override
    public void run(String... args) throws Exception {
        // Automatically seed the predefined roles required by the schema
        seedRoleIfNotFound("ADMIN");
        seedRoleIfNotFound("TEACHER");
        seedRoleIfNotFound("STUDENT");
    }

    /**
     * Helper method to search for a role by name.
     * If the role is not found, it is created and persisted to the database.
     *
     * @param roleName the name of the role to seed
     */
    private void seedRoleIfNotFound(String roleName) {
        // Query the database to check if the role exists
        if (roleRepository.findByName(roleName).isEmpty()) {
            // Build the Role entity using Lombok Builder
            Role role = Role.builder()
                    .name(roleName)
                    .build();

            // Save to database
            roleRepository.save(role);
            System.out.println("DatabaseInitializer: Seeded default role -> " + roleName);
        }
    }
}
