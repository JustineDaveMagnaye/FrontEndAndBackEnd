package com.rocs.osd.controller.station;

import com.rocs.osd.domain.station.Station;
import com.rocs.osd.service.station.StationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/Station")
public class StationController {
    private StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping("/stations")
    public ResponseEntity<List<Station>> getAllStation() {
        return new ResponseEntity<>(stationService.getAllStation(), HttpStatus.OK);
    }
}
