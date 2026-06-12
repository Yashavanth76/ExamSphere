package com.projects.ExamSphere.repository;

import com.projects.ExamSphere.entity.RetakeRequest;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetakeRequestRepository extends JpaRepository<RetakeRequest, Long> {
    List<RetakeRequest> findByStatus(String status);
//    public RetakeRequest save(RetakeRequest request) {
//    }
//
//    public RetakeRequest findById(Long requestId) {
//    }
//
//    public void delete(RetakeRequest targetRequest) {
//    }
}
