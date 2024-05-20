package com.rocs.osd.service.station.impl;

import com.rocs.osd.domain.station.Station;
import com.rocs.osd.repository.station.StationRepository;
import com.rocs.osd.service.station.StationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationServiceImpl implements StationService {
    private StationRepository stationRepository;

    public StationServiceImpl(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @Override
    public List<Station> getAllStation() {
        return stationRepository.findAll();
    }
}
