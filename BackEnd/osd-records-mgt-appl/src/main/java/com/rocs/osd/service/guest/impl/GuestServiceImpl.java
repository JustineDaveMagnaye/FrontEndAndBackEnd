package com.rocs.osd.service.guest.impl;

import com.rocs.osd.domain.guest.Guest;
import com.rocs.osd.repository.guest.GuestRepository;
import com.rocs.osd.service.guest.GuestService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestServiceImpl implements GuestService {
    private GuestRepository guestRepository;

    public GuestServiceImpl(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public List<Guest> getAllGuest() {
        return guestRepository.findAll();
    }
}
