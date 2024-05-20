package com.rocs.osd.service.section.impl;

import com.rocs.osd.domain.section.Section;
import com.rocs.osd.repository.section.SectionRepository;
import com.rocs.osd.service.section.SectionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionServiceImpl implements SectionService {
    private SectionRepository sectionRepository;

    public SectionServiceImpl(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    @Override
    public List<Section> getAllSection() {
        return sectionRepository.findAll();
    }
}
