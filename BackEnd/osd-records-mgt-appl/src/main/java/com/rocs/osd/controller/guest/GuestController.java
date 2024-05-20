package com.rocs.osd.controller.guest;

import com.rocs.osd.domain.guest.Guest;
import com.rocs.osd.service.guest.GuestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
