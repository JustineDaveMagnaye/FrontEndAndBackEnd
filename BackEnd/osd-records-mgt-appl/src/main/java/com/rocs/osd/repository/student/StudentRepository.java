package com.rocs.osd.repository.student;


import com.rocs.osd.domain.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByStudentNumberAndEmail(String studentNumber, String email);

    Student findByStudentNumber(String studentNumber);

}
