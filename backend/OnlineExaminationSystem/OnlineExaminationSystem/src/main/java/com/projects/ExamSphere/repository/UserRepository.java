package com.projects.ExamSphere.repository;

import com.projects.ExamSphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

//    public User save(User student) {
//    }

    List<User> findByRoleAndIsApproved(String role, String isApproved);

    List<User> findByRole(String role);

//    public void delete(User targetUser) {
//    }
}
