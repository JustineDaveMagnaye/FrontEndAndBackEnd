package com.rocs.osd.service.csSlip;

import com.rocs.osd.domain.csSlip.CsSlip;
import com.rocs.osd.domain.student.Student;
import com.rocs.osd.domain.violation.Violation;

import java.util.List;
import java.util.Optional;

public interface CsSlipService {
    List<CsSlip> getAllCsSlip();
    Optional<CsSlip> getCsSlipById(Long id);
    List<CsSlip> getCsSlipByStudentName(String name);
    List<CsSlip> getCsSlipReportByStudentName(String name);

    CsSlip addCsSlip(CsSlip csSlip);

    int getTotalCsHoursByStudent(Long studentId);
    void updateDeduction(Long csSlipId, int deduction);
}