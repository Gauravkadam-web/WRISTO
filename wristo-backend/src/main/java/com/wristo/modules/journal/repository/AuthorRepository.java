package com.wristo.modules.journal.repository;

import com.wristo.modules.journal.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {
    Optional<Author> findByNameIgnoreCase(String name);
}
