package org.example.controller;
import org.example.domain.*;
import org.example.dto.*;
import org.example.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Book;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/test/book")

public class TestController {

    @Autowired
    private BookService bookService;

    @PostMapping("/create")
    public ResponseEntity<?> createBook(@RequestBody BookDTO bookDTO) {
        try {
            BookEntity bookEntity = BookDTO.toEntity(bookDTO);
            List<BookEntity> list = bookService.create(bookEntity);
            List<BookDTO> dtos = list.stream().map(BookDTO::new).toList();
            ResponseDTO<BookDTO> response = ResponseDTO.<BookDTO>builder().data(dtos).build();

            return ResponseEntity.ok().body(response);



        }  catch( Exception e){
            return ResponseEntity.badRequest().body(
                    ResponseDTO.<BookDTO>builder().error("도서 등록 실패: "+ e.getMessage()).build());
        }
        }


    @GetMapping("/all")
    public ResponseEntity<?> getAllBooks() {
        List<BookEntity> list = bookService.getAll();
        List<BookDTO> dtos = list.stream().map(BookDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok().body(ResponseDTO.<BookDTO>builder().data(dtos).build());
        

    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam String title) {
        List<BookEntity> list = bookService.retrieve(title);
        List<BookDTO> dtos = list.stream().map(BookDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok().body(ResponseDTO.<BookDTO>builder().data(dtos).build());

    }


    @PutMapping("/update")
    public ResponseEntity<?> updateBook(@RequestBody BookDTO dto) {
        try {
            List<BookEntity> list = bookService.update(BookDTO.toEntity(dto));
            List<BookDTO> dtos = list.stream().map(BookDTO::new).collect(Collectors.toList());
            return ResponseEntity.ok().body(ResponseDTO.<BookDTO>builder().data(dtos).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
               ResponseDTO.<BookDTO>builder().error("도서 삭제 결과: "+e.getMessage()).build());


        }
    }
}
