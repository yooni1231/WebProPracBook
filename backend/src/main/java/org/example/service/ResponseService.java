package org.example.service;

import org.example.dto.ResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseService {
    public <T> ResponseDTO<T> success(List<T> data) {
        return ResponseDTO.<T>builder().data(data).build();

    }

    public <T> ResponseDTO<T> fail(String errorMessage) {
        return ResponseDTO.<T>builder().error(errorMessage).build();
    }
}