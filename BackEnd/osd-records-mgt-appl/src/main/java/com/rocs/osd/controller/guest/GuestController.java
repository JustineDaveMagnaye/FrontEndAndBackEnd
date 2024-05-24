package com.rocs.osd.controller.guest;

import com.rocs.osd.domain.csSlip.CsSlip;
import com.rocs.osd.domain.guest.Guest;
import com.rocs.osd.service.guest.GuestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Guest")
public class GuestController {
    private GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @GetMapping("/guests")
    public ResponseEntity<List<Guest>> getAllGuest() {
        return new ResponseEntity<>(guestService.getAllGuest(), HttpStatus.OK);
    }
    @GetMapping("/getGuestByGuestNumber/{guestNumber}")
    public ResponseEntity<Guest> getGuestByGuestNumber(@PathVariable String guestNumber) {
        Guest guest = guestService.getStudentByStudentNumber(guestNumber);
        return new ResponseEntity<>(guest, HttpStatus.OK);
    }
    @GetMapping("/guests/{guestId}/get-beneficiaries")
    public ResponseEntity<List<Guest>> getGuestBeneficiaries(@PathVariable Long guestId) {
        List<Guest> beneficiaries = guestService.getGuestBeneficiaries(guestId);
        return new ResponseEntity<>(beneficiaries, HttpStatus.OK);
    }
    @PostMapping("/addGuest")
    public ResponseEntity<String> addGuest(@RequestBody Guest guest){
        try {
            guestService.addGuest(guest);
            return new ResponseEntity<>("Guest Successfully Added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Guest Has Not Been Added", HttpStatus.OK);
        }
    }
}
