package com.projects.ExamSphere.service;

import com.projects.ExamSphere.entity.User;
import com.projects.ExamSphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll(); // 🟢 FIXED
    }

    public User registerStudent(User student){
        if (userRepository.findByUsername(student.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already registered inside the portal database.");
        }
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        student.setRole("STUDENT");
        student.setIsApproved("PENDING");
        return userRepository.save(student);
    }

    public User provisionFaculty(User teacher) {
        if (userRepository.findByUsername(teacher.getUsername()).isPresent()) {
            throw new RuntimeException("Faculty username handle is already allocated.");
        }
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        teacher.setRole("TEACHER");
        teacher.setIsApproved("APPROVED");
        return userRepository.save(teacher);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getPendingStudents() {
        return userRepository.findByRoleAndIsApproved("STUDENT", "PENDING");
    }

    public List<User> getVerifiedStudents() {
        return userRepository.findByRoleAndIsApproved("STUDENT", "APPROVED");
    }

    public List<User> getAllTeachers() {
        return userRepository.findByRole("TEACHER");
    }

    public User updatedApprovalStatus(String username, String newStatus) {
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Target user profile registry not found."));

        targetUser.setIsApproved(newStatus);
        User updatedUser = userRepository.save(targetUser);

        if ("APPROVED".equalsIgnoreCase(newStatus)) {
            System.out.println("SMTP OUTBOX SIMULATION Trigger: Welcome email sent to: " + updatedUser.getEmail());
        }
        return updatedUser;
    }

    public void removeUserByUsername(String username) {
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Target user profile registry not found."));
        userRepository.delete(targetUser);
    }

    // 🟢 NEW: Persists modified entity variables directly back into MySQL
    public User saveUserDirectly(User user) {
        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}