package com.rocs.osd.domain.student;

import com.rocs.osd.domain.person.Person;
import com.rocs.osd.domain.section.Section;
import com.rocs.osd.domain.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Entity
@Data
public class Student extends Person implements Serializable {

    @Column(length = 10)
    private String studentNumber;
    @ManyToOne
    private Section section;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
