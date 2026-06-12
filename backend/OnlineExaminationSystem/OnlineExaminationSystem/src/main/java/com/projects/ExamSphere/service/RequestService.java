package com.projects.ExamSphere.service;

import com.projects.ExamSphere.entity.Exam;
import com.projects.ExamSphere.entity.ExamAttempt;
import com.projects.ExamSphere.entity.RetakeRequest;
import com.projects.ExamSphere.entity.User;
import com.projects.ExamSphere.repository.ExamAttemptRepository;
import com.projects.ExamSphere.repository.RetakeRequestRepository;
import org.hibernate.query.NativeQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {
    @Autowired
    private ExamAttemptRepository attemptRepository;

    @Autowired
    private RetakeRequestRepository retakeRequestRepository;

    public ExamAttempt logExamAttempt(User student, Exam exam, Integer finalPercentageScore) {
        ExamAttempt attempt = new ExamAttempt();
        attempt.setStudent(student);
        attempt.setExam(exam);
        attempt.setScore(finalPercentageScore);
        return attemptRepository.save(attempt);
    }

    public List<ExamAttempt> getAttemptsByStudent(User student){
        return attemptRepository.findByStudent(student);
    }

    public List<RetakeRequest> getPendingRetakeRequests() {
        return retakeRequestRepository.findByStatus("PENDING");
    }

    public RetakeRequest fileRetakeRequest(User student, Exam exam) {
        RetakeRequest request = new RetakeRequest();
        request.setStudent(student);
        request.setExam(exam);
        request.setStatus("PENDING");
        return retakeRequestRepository.save(request);
    }

    // PROCESSING PERMISSIONS ALIGNMENT LOG CORE
    public void evaluateRetakeRequest(Long requestId, String evaluationAction) {
        RetakeRequest targetRequest = retakeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Target system request record node not found."));

        if ("APPROVED".equalsIgnoreCase(evaluationAction)) {
            // Locate the past history entry and purge it to re-enable evaluation access doors
            User targetStudent = targetRequest.getStudent();
            Exam targetExam = targetRequest.getExam();

            List<ExamAttempt> historyLogs = attemptRepository.findByStudent(targetStudent);
            for (ExamAttempt log : historyLogs) {
                if (log.getExam().getExamId().equals(targetExam.getExamId())) {
                    attemptRepository.delete(log); // Wipes out past low score records natively
                }
            }
            retakeRequestRepository.delete(targetRequest); // Removes from verification logs frame
        } else {
            targetRequest.setStatus("REJECTED");
            retakeRequestRepository.save(targetRequest);
        }
    }
}
