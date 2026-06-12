package com.projects.ExamSphere.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonIgnore
    private Exam exam;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "option_a", nullable = false, length = 255)
    private String optionA;

    @Column(name = "option_b", nullable = false, length = 255)
    private String optionB;

    @Column(name = "option_c", nullable = false, length = 255)
    private String optionC;

    @Column(name = "option_d", nullable = false, length = 255)
    private String optionD;

    @Column(name = "correct_index", nullable = false)
    private Integer correctIndex; // 0=A, 1=B, 2=C, 3=D
}
