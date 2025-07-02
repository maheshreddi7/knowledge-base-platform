package com.mahesh.knowledge_base_server.service;

import com.mahesh.knowledge_base_server.dto.SpaceDto;
import com.mahesh.knowledge_base_server.entity.Space;
import com.mahesh.knowledge_base_server.entity.Document;
import com.mahesh.knowledge_base_server.repository.SpaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SpaceService {
    @Autowired
    private SpaceRepository spaceRepository;

    public List<SpaceDto> getAllSpaces() {
        return spaceRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public SpaceDto getSpaceById(Long id) {
        Optional<Space> space = spaceRepository.findById(id);
        return space.map(this::toDto).orElse(null);
    }

    public SpaceDto createSpace(SpaceDto dto) {
        Space space = new Space();
        space.setName(dto.getName());
        space.setDescription(dto.getDescription());
        Space saved = spaceRepository.save(space);
        return toDto(saved);
    }

    public SpaceDto updateSpace(Long id, SpaceDto dto) {
        Optional<Space> optional = spaceRepository.findById(id);
        if (optional.isPresent()) {
            Space space = optional.get();
            space.setName(dto.getName());
            space.setDescription(dto.getDescription());
            return toDto(spaceRepository.save(space));
        }
        return null;
    }

    public void deleteSpace(Long id) {
        spaceRepository.deleteById(id);
    }

    private SpaceDto toDto(Space space) {
        SpaceDto dto = new SpaceDto();
        dto.setId(space.getId());
        dto.setName(space.getName());
        dto.setDescription(space.getDescription());
        if (space.getDocuments() != null) {
            java.util.List<Long> docIds = new java.util.ArrayList<>();
            for (Object obj : space.getDocuments()) {
                if (obj instanceof com.mahesh.knowledge_base_server.entity.Document) {
                    com.mahesh.knowledge_base_server.entity.Document doc = (com.mahesh.knowledge_base_server.entity.Document) obj;
                    docIds.add(doc.getId());
                }
            }
            dto.setDocumentIds(docIds);
        }
        return dto;
    }
} 