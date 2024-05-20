package com.rocs.osd.repository.employee;

import com.rocs.osd.domain.employee.Employee;
import com.rocs.osd.domain.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, String> {
    boolean existsByEmployeeNumberAndEmail(String employeeNumber, String email);

    Employee findByEmployeeNumber(String employeeNumber);

}
