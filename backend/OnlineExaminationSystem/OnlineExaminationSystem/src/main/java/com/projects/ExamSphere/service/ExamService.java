package com.projects.ExamSphere.service;

import com.projects.ExamSphere.entity.Exam;
import com.projects.ExamSphere.entity.Question;
import com.projects.ExamSphere.entity.User;
import com.projects.ExamSphere.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public Exam createExam(Exam exam, User facultyCreator) {
        exam.setCreator(facultyCreator);

        // Build bidirectional relational map links inside the collection pool
        if (exam.getQuestions() != null) {
            for (Question question : exam.getQuestions()) {
                question.setExam(exam);
            }
        }
        return examRepository.save(exam);
    }

    public List<Exam> getExamsByStream(String stream) {
        return examRepository.findByStream(stream);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam getExamById(Long examId){
        return examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Target evaluation exam index node not found."));
    }
}
