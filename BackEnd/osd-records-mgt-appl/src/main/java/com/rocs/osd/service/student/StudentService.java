package com.rocs.osd.service.student;

import com.rocs.osd.domain.student.Student;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudent();
    Optional<Student> getStudentById(Long id);

    Student getStudentByNumber(String studentNumber);
}
