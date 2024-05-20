package com.rocs.osd.service.offense;

import com.rocs.osd.domain.offense.Offense;

import java.util.List;

public interface OffenseService {
    List<Offense> getAllOffense();

    List<Offense> getOffenseByType(String type);
    Offense getOffenseByDescription(String description);

    Offense addOffense(Offense offense);
    Offense updateOffense(Offense offense);

}