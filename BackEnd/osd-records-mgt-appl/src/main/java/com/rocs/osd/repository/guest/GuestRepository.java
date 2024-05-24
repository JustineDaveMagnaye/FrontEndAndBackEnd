package com.rocs.osd.repository.guest;

import com.rocs.osd.domain.guest.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    List<Guest> findGuestById(Long guestId);

    Guest findByGuestNumber(String guestNumber);
}
