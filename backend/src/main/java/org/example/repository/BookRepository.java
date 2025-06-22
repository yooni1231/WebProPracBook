package org.example.repository;

import org.example.domain.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<BookEntity, String> {
    List<BookEntity> findByTitleContaining(String title);
    void deleteByTitle(String title);

}