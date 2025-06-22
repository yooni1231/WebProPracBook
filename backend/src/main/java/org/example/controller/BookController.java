package org.example.controller;
import org.example.dto.BookDTO;
import org.example.dto.ResponseDTO;
import org.example.domain.BookEntity;
import org.example.service.BookService;
import org.example.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/books")


public class BookController{
    @Autowired
    private BookService bookservice;

    @Autowired
    private ResponseService responseService;

    @PostMapping
    public ResponseEntity<ResponseDTO<BookDTO>> create(@RequestBody BookDTO dto){
        try{
            BookEntity entity = BookDTO.toEntity(dto);
            List <BookEntity> list =bookservice.create(entity);
            List <BookDTO> dtos = list.stream().map(BookDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok(responseService.success(dtos));

        } catch(Exception e){
            return ResponseEntity.badRequest().body(responseService.fail(e.getMessage()));
        }
    }
    @GetMapping
    public ResponseEntity<List<BookDTO>> retrieve(@RequestParam(required = false) String title) {
        System.out.println("🔍 title param: " + title);
        List<BookEntity> books = (title != null && !title.isEmpty())
                ? bookservice.retrieve(title)
                : bookservice.getAll(); // 전체 리스트 반환
        List<BookDTO> dtos = books.stream().map(BookDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);  // ResponseDTO 대신 순수 List도 가능
    }



    @PutMapping
    public ResponseEntity<ResponseDTO<BookDTO>> update(@RequestBody BookDTO dto){
        BookEntity entity = BookDTO.toEntity(dto);
        List<BookEntity> list = bookservice.update(entity);
        List<BookDTO> dtos = list.stream().map(BookDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(responseService.success(dtos));
    }

    @DeleteMapping
    public ResponseEntity<ResponseDTO<BookDTO>> delete(@RequestBody BookDTO dto){
        try{
            BookEntity entity= BookDTO.toEntity(dto);
            List<BookEntity> list = bookservice.delete(entity);
            List<BookDTO> dtos = list.stream().map(BookDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok(responseService.success(dtos));

        } catch(Exception e){
            return ResponseEntity.badRequest().body(responseService.fail(e.getMessage()));

        }


    }
}