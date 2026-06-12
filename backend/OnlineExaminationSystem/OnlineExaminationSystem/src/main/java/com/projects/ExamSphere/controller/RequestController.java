package com.projects.ExamSphere.controller;

import com.projects.ExamSphere.entity.User;
import com.projects.ExamSphere.service.RequestService;
import com.projects.ExamSphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RequestController {

    @Autowired
    private UserService userService;

    @Autowired
    private RequestService requestService;

    @GetMapping("/all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/pending-students")
    public ResponseEntity<List<User>> getPendingAdmissions() {
        return ResponseEntity.ok(userService.getPendingStudents());
    }

    @PostMapping("/process-admission")
    public ResponseEntity<?> processStudentAdmission(@RequestBody Map<String, String> payload) {
        try {
            String username = payload.get("username");
            String action = payload.get("action"); // APPROVED or REJECTED
            User updatedUser = userService.updatedApprovalStatus(username, action);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/verified-students")
    public ResponseEntity<List<User>> getVerifiedStudents() {
        return ResponseEntity.ok(userService.getVerifiedStudents());
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getAllRegisteredTeachers() {
        return ResponseEntity.ok(userService.getAllTeachers());
    }

    @PostMapping("/provision-teacher")
    public ResponseEntity<?> provisionFacultyAccount(@RequestBody User teacher){
        try {
            User savedTeacher = userService.provisionFaculty(teacher);
            return ResponseEntity.ok(savedTeacher);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/purge-user/{username}")
    public ResponseEntity<?> permanentlyDeleteProfile(@PathVariable String username){
        try {
            userService.removeUserByUsername(username);
            return ResponseEntity.ok(Map.of("message", "Profile purged successfully from the primary database cluster."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending-retakes")
    public ResponseEntity<?> getPendingRetakes(){
        return ResponseEntity.ok(requestService.getPendingRetakeRequests());
    }

    @PostMapping("/process-retake")
    public ResponseEntity<?> evaluateRetakePermission(@RequestBody Map<String, String> payload){
        try {
            Long requestId = Long.parseLong(payload.get("requestId"));
            String action = payload.get("action"); // APPROVED or REJECTED
            requestService.evaluateRetakeRequest(requestId, action);
            return ResponseEntity.ok(Map.of("message", "Retake action processed successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🟢 FIXED: Safe lookup queries to alter Principal entity states directly without breaking account status matrices
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateAdminProfile(@RequestBody Map<String, String> payload) {
        try {
            // Master username string key matching active administrative session logs
            String username = "principal_root";

            String newFullName = payload.get("fullName");
            String newEmail = payload.get("email");
            String newQualification = payload.get("qualification");
            String newFocus = payload.get("focusArea");

            // 1. Direct fetch from MySQL instead of running the student verification service chain
            User updatedUser = userService.getUserByUsername(username);

            if (updatedUser == null) {
                return ResponseEntity.badRequest().body("Database Error: Administrative profile handle 'principal_root' not found.");
            }

            // 2. Map payload updates onto persistent user attributes columns
            updatedUser.setFullName(newFullName);
            updatedUser.setEmail(newEmail);
            updatedUser.setQualification(newQualification);
            updatedUser.setSubjectExpertise(newFocus);

            // 3. Complete transactional commit straight back down to JPA Repository
            User savedUser = userService.saveUserDirectly(updatedUser);

            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Spring Boot Server Error: " + e.getMessage());
        }
    }
}