package com.rocs.osd.controller.csSlip;

import com.rocs.osd.domain.csSlip.CsSlip;
import com.rocs.osd.service.csSlip.CsSlipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/CSSlip")
public class CsSlipController {
    private CsSlipService csSlipService;

    @Autowired
    public CsSlipController(CsSlipService csSlipService) {
        this.csSlipService = csSlipService;
    }

    @GetMapping("/commServSlips")
    public ResponseEntity<List<CsSlip>> getAllCsSlip() {
        return new ResponseEntity<>(csSlipService.getAllCsSlip(), HttpStatus.OK);
    }

    @GetMapping("/commServSlip/{id}")
    public ResponseEntity<Optional<CsSlip>> getCsSlipById(@PathVariable Long id) {
        return new ResponseEntity<>(this.csSlipService.getCsSlipById(id), HttpStatus.OK);
    }

    @GetMapping("/commServSlip/studentNumber/{studentNumber}")
    public ResponseEntity<List<CsSlip>> getCsSlipByStudentNumber(@PathVariable String studentNumber) {
        return new ResponseEntity<>(this.csSlipService.getCsSlipByStudentNumber(studentNumber), HttpStatus.OK);
    }
    @GetMapping("/commServSlip/studentId/{studentId}")
    public ResponseEntity<List<CsSlip>> getCsSlipByStudentId(@PathVariable Long studentId) {
        return new ResponseEntity<>(this.csSlipService.getCsSlipByStudentId(studentId), HttpStatus.OK);
    }

    @GetMapping("/totalCsHours/{studentId}")
    public ResponseEntity<Integer> getTotalCsHoursByStudent(@PathVariable Long studentId) {
        int totalCsHours = csSlipService.getTotalCsHoursByStudent(studentId);
        return new ResponseEntity<>(totalCsHours, HttpStatus.OK);
    }

    @GetMapping("/commServSlipsByName/{name}")
    public ResponseEntity<List<CsSlip>> getCsSlipsByStudentName(@PathVariable String name) {
        List<CsSlip> csSlips = csSlipService.getCsSlipByStudentName(name);
        if (!csSlips.isEmpty()) {
            return new ResponseEntity<>(csSlips, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/commServReportByName/{name}")
    public ResponseEntity<List<CsSlip>> getCsSlipReportByStudentName(@PathVariable String name) {
        List<CsSlip> csSlips = csSlipService.getCsSlipReportByStudentName(name);
        if (!csSlips.isEmpty()) {
            return new ResponseEntity<>(csSlips, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/commServSlip/areaOfCs/{name}")
    public ResponseEntity<List<CsSlip>> getCsSlipReportByStationName(@PathVariable String name) {
        List<CsSlip> csSlips = csSlipService.getCsSlipReportByStationName(name);
        if (!csSlips.isEmpty()) {
            return new ResponseEntity<>(csSlips, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updateDeduction/{csSlipId}")
    public ResponseEntity<String> updateDeduction(@PathVariable Long csSlipId, @RequestParam int deduction) {
        try {
            csSlipService.updateDeduction(csSlipId, deduction);
            return new ResponseEntity<>("Deduction updated successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update deduction: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
//    http://localhost:8080/CSSlip/updateDeduction/1?deduction=2


    @PostMapping("/csSlip")
    public ResponseEntity<String> addCsSlip(@RequestBody CsSlip csSlip){
        try {
            csSlipService.addCsSlip(csSlip);
            return new ResponseEntity<>("Community Service Slip successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Community Service Slip cannot be added", HttpStatus.OK);
        }
    }



}