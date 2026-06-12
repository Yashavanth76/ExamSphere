package com.projects.ExamSphere.controller;

import com.projects.ExamSphere.entity.Exam;
import com.projects.ExamSphere.entity.User;
import com.projects.ExamSphere.service.ExamService;
import com.projects.ExamSphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private UserService userService;

    @PostMapping("/create") // 🟢 FIXED: Added explicit mapping for creation calls
    public ResponseEntity<?> createExam(@RequestBody Exam exam, Principal principal) {
        try {
            String username = principal != null ? principal.getName() : "principal_root"; // Fallback safety for dev permitAll config
            User creator = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found."));

            Exam savedExam = examService.createExam(exam, creator);
            return ResponseEntity.ok(savedExam);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/stream/{streamName}")
    public ResponseEntity<List<Exam>> getExamsByStream(@PathVariable String streamName) {
        return ResponseEntity.ok(examService.getExamsByStream(streamName));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }
}