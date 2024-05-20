package com.rocs.osd.controller.section;

import com.rocs.osd.domain.section.Section;
import com.rocs.osd.service.section.SectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/Section")
public class SectionController {
    private SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    @GetMapping("/sections")
    public ResponseEntity<List<Section>> getAllSection() {
        return new ResponseEntity<>(sectionService.getAllSection(), HttpStatus.OK);
    }
}
