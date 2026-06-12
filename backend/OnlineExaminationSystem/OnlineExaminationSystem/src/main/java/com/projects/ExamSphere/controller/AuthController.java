package com.projects.ExamSphere.controller;

import com.projects.ExamSphere.entity.User;
import com.projects.ExamSphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerStudent(@RequestBody User student) {
        try {
            User savedStudent = userService.registerStudent(student);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Registration submitted successfully! Current status: PENDING approval by the Principal."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // 🟢 FIXED: Master Admin Override now reads dynamically from MySQL database rows
        if ("principal_root".equals(username) && "password123".equals(password)) {
            Optional<User> devAdminOpt = userService.findByUsername("principal_root");

            if (devAdminOpt.isPresent()) {
                User adminUser = devAdminOpt.get();
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "userId", adminUser.getUserId(),
                        "username", adminUser.getUsername(),
                        "fullName", adminUser.getFullName(),
                        "role", adminUser.getRole().toLowerCase(),
                        "email", adminUser.getEmail() != null ? adminUser.getEmail() : "",
                        "qualification", adminUser.getQualification() != null ? adminUser.getQualification() : "",
                        "subjectExpertise", adminUser.getSubjectExpertise() != null ? adminUser.getSubjectExpertise() : ""
                ));
            } else {
                // Secure baseline fallback schema map if your local MySQL table hasn't seeded this admin user row yet
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "username", "principal_root",
                        "fullName", "Dr. K. S. Sharma",
                        "role", "admin",
                        "email", "principal.office@university.edu",
                        "qualification", "",
                        "subjectExpertise", ""
                ));
            }
        }

        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Verify BCrypt hashed password matches incoming text
            if (passwordEncoder.matches(password, user.getPassword())) {

                // Block unapproved students dynamically at login point
                if ("STUDENT".equalsIgnoreCase(user.getRole())) {
                    if ("PENDING".equalsIgnoreCase(user.getIsApproved())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                                "success", false,
                                "message", "Verification Pending: Your profile registration is currently awaiting manual approval from the Principal."
                        ));
                    }
                    if ("REJECTED".equalsIgnoreCase(user.getIsApproved())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                                "success", false,
                                "message", "Access Denied: Your academic account verification request has been rejected."
                        ));
                    }
                }

                // 🟢 FIXED: Added email, qualification, and expertise fields to standard user payload maps
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "userId", user.getUserId(),
                        "username", user.getUsername(),
                        "fullName", user.getFullName(),
                        "role", user.getRole().toLowerCase(),
                        "email", user.getEmail() != null ? user.getEmail() : "",
                        "qualification", user.getQualification() != null ? user.getQualification() : "",
                        "subjectExpertise", user.getSubjectExpertise() != null ? user.getSubjectExpertise() : "",
                        "classStream", user.getClassStream() != null ? user.getClassStream() : ""
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "success", false,
                "message", "Invalid username or password credentials."
        ));
    }
}