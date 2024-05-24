package com.rocs.osd.controller.violation;

import com.rocs.osd.domain.violation.Violation;
import com.rocs.osd.service.violation.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Violation")
public class ViolationController {
    private ViolationService violationService;

    @Autowired
    public ViolationController(ViolationService violationService) {
        this.violationService = violationService;
    }

    @GetMapping("/violations")
    public ResponseEntity<List<Violation>> getAllViolation() {
        return new ResponseEntity<>(violationService.getAllViolation(), HttpStatus.OK);
    }

    @GetMapping("/violation/{id}")
    public ResponseEntity<Optional<Violation>> getViolationById(@PathVariable Long id) {
        return new ResponseEntity<>(this.violationService.getViolationById(id), HttpStatus.OK);
    }

    @GetMapping("/violation/student/{studentId}")
    public ResponseEntity<List<Violation>> getAllViolationByStudentId(@PathVariable Long studentId) {
        return new ResponseEntity<>(this.violationService.getAllViolationByStudentId(studentId), HttpStatus.OK);
    }

    @GetMapping("/violation/student/studentNumber/{studentNumber}")
    public ResponseEntity<List<Violation>> getAllViolationByStudentNumber(@PathVariable String studentNumber) {
        return new ResponseEntity<>(this.violationService.getAllViolationByStudentNumber(studentNumber), HttpStatus.OK);
    }

    @GetMapping("/violation/student/name/{name}")
    public ResponseEntity<List<Violation>> getAllViolationByStudentName(@PathVariable String name) {
        return new ResponseEntity<>(violationService.getAllViolationByStudentName(name), HttpStatus.OK);
    }

    @GetMapping("/violation/date-range")
    public ResponseEntity<List<Violation>> getViolationsByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        return new ResponseEntity<>(this.violationService.getViolationsByDateRange(startDate, endDate), HttpStatus.OK);
    }
    @PostMapping("/violation/addViolation")
    public ResponseEntity<String> addViolation(@RequestBody Violation violation) {
        try {
            violationService.addViolation(violation);
            return new ResponseEntity<>("Violation successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Violation cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/violation/updateViolation")
    public ResponseEntity<String> updateViolation(@RequestBody Violation violation) {
        try {
            violationService.updateViolation(violation);
            return new ResponseEntity<>("Violation successfully updated", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Violation not found", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}