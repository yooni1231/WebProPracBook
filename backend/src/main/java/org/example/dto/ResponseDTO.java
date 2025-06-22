package org.example.dto;

import lombok.*;
import org.checkerframework.checker.units.qual.A;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class ResponseDTO<T> {
    private List<T> data;
    private String error;

    public void setData(List<T> data) {
        this.data = data;
    }

    public void setError(String error) {
        this.error = error;
    }

    public List<T> getData() {
        return data;
    }

    public String getError() {
        return error;
    }
}
