package com.tour.travel.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileStorageService {
    String storeFile(MultipartFile file) throws IOException;
    void deleteFile(String filename);
    boolean isImageFile(MultipartFile file);
}
