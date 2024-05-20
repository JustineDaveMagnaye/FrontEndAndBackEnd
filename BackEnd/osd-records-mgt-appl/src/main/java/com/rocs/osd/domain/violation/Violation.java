package com.rocs.osd.domain.violation;

import com.rocs.osd.domain.employee.Employee;
import com.rocs.osd.domain.offense.Offense;
import com.rocs.osd.domain.student.Student;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Violation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private Date dateOfNotice;

    @ManyToOne
    @JoinColumn(name = "student_number", referencedColumnName = "studentNumber")
    private Student student;


    @ManyToOne
    private Offense offense;

    private int warningNumber;
    private int csHours;

    @Column(length = 64)
    private String disciplinaryAction;

    @OneToMany
    private List<Employee> notedBy;

    @ManyToOne
    private Employee approvedBy;
}
