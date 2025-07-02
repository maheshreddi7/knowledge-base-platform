package com.mahesh.knowledge_base_server.controller;

import com.mahesh.knowledge_base_server.dto.SpaceDto;
import com.mahesh.knowledge_base_server.service.SpaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {
    @Autowired
    private SpaceService spaceService;

    @GetMapping
    public List<SpaceDto> getAllSpaces() {
        return spaceService.getAllSpaces();
    }

    @GetMapping("/{id}")
    public SpaceDto getSpaceById(@PathVariable Long id) {
        return spaceService.getSpaceById(id);
    }

    @PostMapping
    public SpaceDto createSpace(@RequestBody SpaceDto dto) {
        return spaceService.createSpace(dto);
    }

    @PutMapping("/{id}")
    public SpaceDto updateSpace(@PathVariable Long id, @RequestBody SpaceDto dto) {
        return spaceService.updateSpace(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteSpace(@PathVariable Long id) {
        spaceService.deleteSpace(id);
    }
} 