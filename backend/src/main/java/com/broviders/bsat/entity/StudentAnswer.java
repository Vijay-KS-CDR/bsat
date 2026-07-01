package com.broviders.bsat.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * JPA entity representing a student's answer to a specific question inside an attempt.
 */
@Entity
@Table(name = "student_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private TestAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "answer_text", length = 5000)
    private String answerText;

    @Column(name = "marks_awarded")
    private Double marksAwarded;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "remarks", length = 1000)
    private String remarks;

    @Column(nullable = false)
    private String status; // PENDING_REVIEW, EVALUATED
}
