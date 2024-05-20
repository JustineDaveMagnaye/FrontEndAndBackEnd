package com.rocs.osd.repository.guest;

import com.rocs.osd.domain.guest.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}
