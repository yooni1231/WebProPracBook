//실제 비즈니스 로직

package org.example.service;
import org.example.domain.BookEntity;
import org.example.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService{
    @Autowired
    private BookRepository repository;

    public List<BookEntity> create(BookEntity entity){
        entity.setUserId("LeeYunseo");
        repository.save(entity);
        return repository.findAll();

    }

    public List<BookEntity> retrieve(String title){
        return repository.findByTitleContaining(title);
    }

    public List<BookEntity> update(BookEntity entity){
        BookEntity target = repository.findById(entity.getId()).orElseThrow();
        target.setTitle(entity.getTitle());
        target.setAuthor(entity.getAuthor());
        target.setPublisher(entity.getPublisher());
        target.setPrice(entity.getPrice());
        repository.save(target);
        return repository.findAll();

    }

    public List<BookEntity> delete(BookEntity entity){
        repository.deleteById(entity.getId());
        return repository.findAll();
    }

    public List<BookEntity> getAll() {
        return repository.findAll();
    }


}

