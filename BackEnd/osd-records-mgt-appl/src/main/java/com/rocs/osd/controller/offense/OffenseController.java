package com.rocs.osd.controller.offense;

import com.rocs.osd.domain.offense.Offense;
import com.rocs.osd.service.offense.OffenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Offense")
public class OffenseController {
    private OffenseService offenseService;

    @Autowired
    public OffenseController(OffenseService offenseService) {
        this.offenseService = offenseService;
    }

    @GetMapping("/offenses")
    public ResponseEntity<List<Offense>> getAllOffense() {
        return new ResponseEntity<>(offenseService.getAllOffense(), HttpStatus.OK);
    }

    @GetMapping("/offense/{type}")
    public ResponseEntity<List<Offense>> getOffenseByType(@PathVariable String type) {
        List<Offense> offenses = offenseService.getOffenseByType(type);
        return new ResponseEntity<>(offenses, HttpStatus.OK);
    }
    @PostMapping("/offense/addOffense")
    public ResponseEntity<String> addOffense(@RequestBody Offense offense) {
        try {
            Offense newOffense = offenseService.addOffense(offense);
            return new ResponseEntity<>("Offense successfully added", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Offense cannot be added", HttpStatus.INTERNAL_SERVER_ERROR);        }

    }
    @PutMapping("/offense/updateOffense")
    public ResponseEntity<String> updateOffense(@RequestBody Offense offense) {
        Offense updatedOffense = offenseService.updateOffense(offense);
        if (updatedOffense != null) {
            return new ResponseEntity<>("Offense successfully updated", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Offense not found", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/offenses/{offensename}")
    public ResponseEntity<Offense> getOffenseByDescription(@PathVariable("offensename") String description) {
        Offense offense = offenseService.getOffenseByDescription(description);
        if (offense != null) {
            return new ResponseEntity<>(offense, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}