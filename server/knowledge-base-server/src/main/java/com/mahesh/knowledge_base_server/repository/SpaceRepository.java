package com.mahesh.knowledge_base_server.repository;

import com.mahesh.knowledge_base_server.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceRepository extends JpaRepository<Space, Long> {
    // Additional query methods if needed
} 