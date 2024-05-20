package com.rocs.osd.service.offense.impl;

import com.rocs.osd.domain.offense.Offense;
import com.rocs.osd.repository.offense.OffenseRepository;
import com.rocs.osd.service.offense.OffenseService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OffenseServiceImpl implements OffenseService {
    private OffenseRepository offenseRepository;

    public OffenseServiceImpl(OffenseRepository offenseRepository) {
        this.offenseRepository = offenseRepository;
    }

    @Override
    public List<Offense> getAllOffense() {
        return offenseRepository.findAll();
    }

    @Override
    public List<Offense> getOffenseByType(String type) {return offenseRepository.findByType(type); }

    @Override
    public Offense getOffenseByDescription(String description) {
        return offenseRepository.findByDescription(description);
    }
    @Override
    public Offense addOffense(Offense offense) {
        return offenseRepository.save(offense);
    }

    @Override
    public Offense updateOffense(Offense offense) {
        Offense existingOffense = offenseRepository.findById(String.valueOf(offense.getId())).orElse(null);
        if (existingOffense != null) {
            existingOffense.setType(offense.getType());
            existingOffense.setDescription(offense.getDescription());
            return offenseRepository.save(existingOffense);
        }
        return null;
    }
}