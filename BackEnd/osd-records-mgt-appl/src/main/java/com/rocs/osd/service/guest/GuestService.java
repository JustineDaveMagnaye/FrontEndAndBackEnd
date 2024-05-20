package com.rocs.osd.service.guest;

import com.rocs.osd.domain.guest.Guest;
import com.rocs.osd.repository.guest.GuestRepository;

import java.util.List;

public interface GuestService {
    List<Guest> getAllGuest();
}
