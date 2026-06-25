package com.broviders.bsat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * The User entity represents user accounts in the system.
 * It maps directly to the 'users' table in the PostgreSQL database.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * Unique identifier for the user.
     * Maps to the primary key 'id' in the database and is auto-incremented.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The full name of the user. Cannot be null.
     */
    @Column(nullable = false)
    private String name;

    /**
     * The login ID of the user. Must be unique and cannot be null.
     * This acts as the username for login.
     */
    @Column(name = "login_id", nullable = false, unique = true)
    private String loginId;

    /**
     * The BCrypt-hashed password. Cannot be null.
     */
    @Column(nullable = false)
    private String password;

    /**
     * The role assigned to this user (e.g., ADMIN, TEACHER, STUDENT).
     * This is a foreign key relationship to the 'roles' table.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /**
     * Timestamp of when the user account was created.
     * Cannot be updated after registration.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * JPA lifecycle callback that runs before the entity is saved to the database.
     * It automatically sets the 'created_at' timestamp.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
