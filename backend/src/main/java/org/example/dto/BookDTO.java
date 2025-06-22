//실제 비즈니스 로직

package org.example.dto;
import lombok.*;
import org.example.domain.BookEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private String id;
    private String title;
    private String author;
    private String publisher;
    private double price;

    public BookDTO(BookEntity entity){
        this.id=entity.getId();
        this.title=entity.getTitle();
        this.author =entity.getAuthor();
        this.publisher =entity.getPublisher();
        this.price=entity.getPrice();

    }

    public static BookEntity toEntity(BookDTO dto){
        return BookEntity.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .publisher(dto.getPublisher())
                .price(dto.getPrice())
                .build();
    }
}