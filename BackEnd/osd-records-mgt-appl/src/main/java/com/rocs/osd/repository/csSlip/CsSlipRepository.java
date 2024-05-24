package com.rocs.osd.repository.csSlip;


import com.rocs.osd.domain.csSlip.CsSlip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CsSlipRepository extends JpaRepository<CsSlip, Long> {
    List<CsSlip> findByStudent_FirstNameContainingOrStudent_MiddleNameContainingOrStudent_LastNameContaining(String firstName, String middleName, String lastName);
    List<CsSlip> findByAreaOfCommServ_StationNameIgnoreCase(String name);
    List<CsSlip> findByStudentStudentNumber(String studentStudentNumber);

}
