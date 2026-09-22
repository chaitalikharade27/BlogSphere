package com.blogging.blogging_system.repository;

import com.blogging.blogging_system.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findFirstByNameIgnoreCase(String name);
}