package com.broviders.bsat.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * The Role entity represents the user roles in the system (e.g., ADMIN, TEACHER, STUDENT).
 * It maps directly to the 'roles' table in the PostgreSQL database.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    /**
     * Unique identifier for the role.
     * Maps to the primary key 'id' in the database and is auto-incremented.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * The name of the role (e.g., ADMIN, TEACHER, STUDENT).
     * Must be unique and cannot be null.
     */
    @Column(nullable = false, unique = true)
    private String name;
}
