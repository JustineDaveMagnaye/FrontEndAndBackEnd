package com.rocs.osd.service.external;

import com.rocs.osd.domain.external.External;
import com.rocs.osd.repository.external.ExternalRepository;

import java.util.List;

public interface ExternalService {
    List<External> getAllExternal();
}
