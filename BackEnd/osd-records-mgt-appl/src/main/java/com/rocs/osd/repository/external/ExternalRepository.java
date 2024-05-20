package com.rocs.osd.repository.external;

import com.rocs.osd.domain.external.External;
import com.rocs.osd.domain.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalRepository extends JpaRepository<External, Long> {
    boolean existsByExternalNumberAndEmail(String externalNumber, String email);
    External findByExternalNumber(String externalId);

}
