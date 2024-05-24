package com.rocs.osd.service.guest;

import com.rocs.osd.domain.csSlip.CsSlip;
import com.rocs.osd.domain.guest.Guest;
import com.rocs.osd.repository.guest.GuestRepository;

import java.util.List;

public interface GuestService {
    List<Guest> getAllGuest();
    Guest addGuest(Guest guest);
    List<Guest> getGuestBeneficiaries(Long guestId);

    Guest getStudentByStudentNumber(String studentNumber);

}
