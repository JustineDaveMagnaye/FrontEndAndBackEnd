package com.rocs.osd.service.csSlip.impl;

import com.rocs.osd.domain.csReport.CsReport;
import com.rocs.osd.domain.csSlip.CsSlip;
import com.rocs.osd.domain.student.Student;
import com.rocs.osd.domain.violation.Violation;
import com.rocs.osd.exception.ResourceNotFoundException;
import com.rocs.osd.repository.csReport.CsReportRepository;
import com.rocs.osd.repository.csSlip.CsSlipRepository;
import com.rocs.osd.repository.student.StudentRepository;
import com.rocs.osd.repository.violation.ViolationRepository;
import com.rocs.osd.service.csSlip.CsSlipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CsSlipServiceImpl implements CsSlipService {
    private CsSlipRepository csSlipRepository;
    private StudentRepository studentRepository;
    private ViolationRepository violationRepository;

    private CsReportRepository csReportRepository;

    @Autowired
    public CsSlipServiceImpl(CsSlipRepository csSlipRepository, StudentRepository studentRepository, ViolationRepository violationRepository, CsReportRepository csReportRepository) {
        this.csSlipRepository = csSlipRepository;
        this.violationRepository = violationRepository;
        this.studentRepository = studentRepository;
        this.csReportRepository = csReportRepository;
    }

    @Override
    public List<CsSlip> getAllCsSlip() {
        return csSlipRepository.findAll();
    }

    @Override
    public Optional<CsSlip> getCsSlipById(Long id) {
        return csSlipRepository.findById(id);
    }

    @Override
    public int getTotalCsHoursByStudent(Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            List<Violation> violations = violationRepository.findByStudentId(studentId);
            int totalCsHours = violations.stream().mapToInt(Violation::getCsHours).sum();
            return totalCsHours;
        } else {
            throw new IllegalArgumentException("Student not found with id: " + studentId);
        }
    }

    @Override
    public void updateDeduction(Long csSlipId, int deduction) {
        CsSlip csSlip = csSlipRepository.findById(csSlipId)
                .orElseThrow(() -> new RuntimeException("CS Slip not found with id " + csSlipId));

        csSlip.setDeduction(deduction);
        csSlipRepository.save(csSlip);
    }

    @Override
    public CsSlip addCsSlip(CsSlip csSlip) {return csSlipRepository.save(csSlip); }

    @Override
    public List<CsSlip> getCsSlipByStudentName(String name) {
        List<CsSlip> csSlips = csSlipRepository.findByStudent_FirstNameContainingOrStudent_MiddleNameContainingOrStudent_LastNameContaining(name, name, name);
        return csSlips;

    }

    @Override
    public List<CsSlip> getCsSlipReportByStudentName(String name) {
        List<CsSlip> csSlips = csSlipRepository.findByStudent_FirstNameContainingOrStudent_MiddleNameContainingOrStudent_LastNameContaining(name, name, name);

        return csSlips;
    }

    @Transactional
    public CsReport addCsReportToCsSlip(Long csSlipId, CsReport csReport) {
        CsSlip csSlip = csSlipRepository.findById(csSlipId)
                .orElseThrow(() -> new ResourceNotFoundException("CsSlip not found"));
        csSlip.addReport(csReport);
        csReport = csReportRepository.save(csReport);
        csSlipRepository.save(csSlip);
        return csReport;
    }
}