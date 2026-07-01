package com.broviders.bsat.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuration class for Spring Security.
 * Sets up password hashing, JWT stateless authentication, entry points, and path authorizations.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired(required = false)
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired(required = false)
    private JwtAccessDeniedHandler accessDeniedHandler;

    @Autowired(required = false)
    private JwtAuthenticationFilter authenticationJwtTokenFilter;

    /**
     * Exposes a PasswordEncoder bean that uses the BCrypt hashing algorithm.
     *
     * @return the BCrypt password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures HTTP security rules, filter chain, CSRF, session state, and route authorizations.
     *
     * @param http the HttpSecurity builder
     * @return the configured SecurityFilterChain
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF protection since we are building stateless API endpoints
            .csrf(csrf -> csrf.disable())
            // Configure custom handlers for exceptions
            .exceptionHandling(exception -> {
                if (unauthorizedHandler != null) {
                    exception.authenticationEntryPoint(unauthorizedHandler);
                }
                if (accessDeniedHandler != null) {
                    exception.accessDeniedHandler(accessDeniedHandler);
                }
            })
            // Configure stateless session management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow authentication endpoint requests (login / registration) without token
                .requestMatchers("/api/auth/**").permitAll()
                
                // ADMIN access
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/students/**").hasRole("ADMIN")
                .requestMatchers("/api/teachers/**").hasRole("ADMIN")
                .requestMatchers("/api/subjects/**").hasRole("ADMIN")

                // ADMIN & TEACHER shared access
                .requestMatchers("/api/tests/**").hasAnyRole("ADMIN", "TEACHER")
                .requestMatchers("/api/questions/**").hasAnyRole("ADMIN", "TEACHER")
                .requestMatchers("/api/evaluations/**").hasAnyRole("ADMIN", "TEACHER")
                
                // TEACHER access
                .requestMatchers("/api/teacher/**").hasRole("TEACHER")
                
                // STUDENT access
                .requestMatchers("/api/student/**").hasRole("STUDENT")
                .requestMatchers("/api/exams/**").hasRole("STUDENT")

                // Results review access (STUDENT gets own review, TEACHER/ADMIN get reviews and general results list)
                .requestMatchers("/api/results/review/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers("/api/results/**").hasAnyRole("TEACHER", "ADMIN")
                
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );

        if (authenticationJwtTokenFilter != null) {
            // Add the JWT token filter before Spring Security's default UsernamePasswordAuthenticationFilter
            http.addFilterBefore(authenticationJwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
        }

        return http.build();
    }
}
