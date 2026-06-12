package com.projects.ExamSphere.repository;

import com.projects.ExamSphere.entity.ExamAttempt;
import com.projects.ExamSphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
//    public ExamAttempt save(ExamAttempt attempt) {
//    }

    List<ExamAttempt> findByStudent(User student);

//    public void delete(ExamAttempt log) {
//    }
}
