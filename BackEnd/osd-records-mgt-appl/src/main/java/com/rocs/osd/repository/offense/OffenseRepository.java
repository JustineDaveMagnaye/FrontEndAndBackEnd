package com.rocs.osd.repository.offense;

import com.rocs.osd.domain.offense.Offense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OffenseRepository extends JpaRepository<Offense, String> {
    List<Offense> findByType(String type);
    Offense findByDescription(String description);
}
