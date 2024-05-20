package com.rocs.osd.domain.csReport;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Data
public class CsReport implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private Date dateOfCs;
    private Timestamp timeIn;
    private Timestamp timeOut;
    private int hoursCompleted;
    @Column(length = 32)
    private String natureOfWork;
    @Column(length = 16)
    private String status;
    @Column(length = 64)
    private String remarks;
}
