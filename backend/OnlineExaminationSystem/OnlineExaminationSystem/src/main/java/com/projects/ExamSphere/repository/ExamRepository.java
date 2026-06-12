package com.projects.ExamSphere.repository;

import com.projects.ExamSphere.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
//    public Exam save(Exam exam) {
//    }
//
//    public Object findById(Long examId) {
//    }
//
//    public List<Exam> findAll() {
//    }

    List<Exam> findByStream(String stream);
}
