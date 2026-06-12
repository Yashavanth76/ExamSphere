package com.projects.ExamSphere.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String role; // STUDENT, TEACHER, ADMIN

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "class_stream", length = 30)
    private String classStream; // BCA, Engineering, BCom, etc.

    private LocalDate dob;

    @Column(length = 15)
    private String gender;

    @Column(length = 100)
    private String qualification;

    @Column(name = "subject_expertise", length = 100)
    private String subjectExpertise;

    // DATABASE MODIFICATION: Holds registration locks until Principal verification
    @Column(name = "is_approved", length = 20)
    private String isApproved = "PENDING"; //PENDING, APPROVED, REJECTED
}
