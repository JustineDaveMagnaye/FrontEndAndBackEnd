package com.rocs.osd.domain.user;

import com.rocs.osd.domain.employee.Employee;
import com.rocs.osd.domain.external.External;
import com.rocs.osd.domain.guest.Guest;
import com.rocs.osd.domain.student.Student;
import com.rocs.osd.utils.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity(name = "login")
@Data
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String userId;
    private String username;
    private String password;
    private Date lastLoginDate;
    private Date joinDate;
    private String role;
    private String otp;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Student student;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Employee employee;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private External external;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Guest guest;

    @Column(name = "authorities", nullable = false)
    @Convert(converter = StringListConverter.class)
    private List<String> authorities = new ArrayList<>();

    private boolean isActive;
    private boolean isLocked;
}
