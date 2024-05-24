package com.rocs.osd.service.violation;

import com.rocs.osd.domain.violation.Violation;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ViolationService {
    List<Violation> getAllViolation();
    Optional<Violation> getViolationById(Long id);
    List<Violation> getAllViolationByStudentId(Long studentId);
    List<Violation> getAllViolationByStudentNumber(String studentNumber);

    List<Violation> getAllViolationByStudentName(String name);

    List<Violation> getViolationsByDateRange(Date startDate, Date endDate);
    void addViolation(Violation violation);
    void updateViolation(Violation violation);
}