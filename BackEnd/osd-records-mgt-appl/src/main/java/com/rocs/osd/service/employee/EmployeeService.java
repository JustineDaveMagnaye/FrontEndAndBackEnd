package com.rocs.osd.service.employee;

import com.rocs.osd.domain.employee.Employee;
import com.rocs.osd.repository.employee.EmployeeRepository;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployee();
}
