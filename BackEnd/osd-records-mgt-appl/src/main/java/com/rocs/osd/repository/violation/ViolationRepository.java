package com.rocs.osd.repository.violation;


import com.rocs.osd.domain.violation.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByStudentId(Long studentId);

    @Query("SELECT v FROM Violation v WHERE v.dateOfNotice BETWEEN :startDate AND :endDate")
    List<Violation> findByDateOfNoticeBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    List<Violation> findByStudentFirstNameContainingIgnoreCaseOrStudentMiddleNameContainingIgnoreCaseOrStudentLastNameContainingIgnoreCase(String firstName, String middleName, String lastName);
}