package com.rocs.osd.service.violation.impl;

import com.rocs.osd.domain.violation.Violation;
import com.rocs.osd.repository.violation.ViolationRepository;
import com.rocs.osd.service.violation.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ViolationServiceImpl implements ViolationService {
    private ViolationRepository violationRepository;

    @Autowired
    public ViolationServiceImpl (ViolationRepository violationRepository) {
        this.violationRepository = violationRepository;
    }

    @Override
    public List<Violation> getAllViolation() {
        return violationRepository.findAll();
    }

    @Override
    public Optional<Violation> getViolationById(Long id) {
        return violationRepository.findById(id);
    }

    @Override
    public List<Violation> getAllViolationByStudentId(Long studentId) {
        return violationRepository.findByStudentId(studentId);
    }

    @Override
    public List<Violation> getAllViolationByStudentNumber(String studentNumber) {
        return violationRepository.findByStudentStudentNumber(studentNumber);
    }

    @Override
    public List<Violation> getViolationsByDateRange(Date startDate, Date endDate) {
        return violationRepository.findByDateOfNoticeBetween(startDate, endDate);
    }

    @Override
    public List<Violation> getAllViolationByStudentName(String name) {
        return violationRepository.findByStudentFirstNameContainingIgnoreCaseOrStudentMiddleNameContainingIgnoreCaseOrStudentLastNameContainingIgnoreCase(name, name, name);
    }
    @Override
    public void addViolation(Violation violation) {
        violationRepository.save(violation);
    }

    @Override
    public void updateViolation(Violation violation) {
        if (violationRepository.existsById(violation.getId())) {
            violationRepository.save(violation);
        } else {
            throw new IllegalArgumentException("Violation with ID " + violation.getId() + " not found.");
        }
    }
}