package com.tour.travel.Service.impl;

import com.tour.travel.Entity.WebsiteSettingEntity;
import com.tour.travel.dto.request.websitesetting.WebsiteSettingRequest;
import com.tour.travel.dto.response.websitesetting.WebsiteSettingResponse;
import com.tour.travel.Repository.WebsiteSettingRepository;
import com.tour.travel.Service.IWebsiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WebsiteSettingService implements IWebsiteSettingService {

    private final WebsiteSettingRepository websiteSettingRepository;

    @Override
    public WebsiteSettingResponse getWebsiteSettings() {
        WebsiteSettingEntity entity = websiteSettingRepository.findAll()
                .stream()
                .findFirst()
                .orElse(createDefaultSettings());

        return mapToResponse(entity);
    }

    @Override
    @Transactional
    public WebsiteSettingResponse updateWebsiteSettings(WebsiteSettingRequest request) {
        WebsiteSettingEntity entity = websiteSettingRepository.findAll()
                .stream()
                .findFirst()
                .orElse(new WebsiteSettingEntity());

        entity.setWebsiteName(request.getWebsiteName());
        entity.setPhone(request.getPhone());
        entity.setEmail(request.getEmail());
        entity.setAddress(request.getAddress());

        WebsiteSettingEntity savedEntity = websiteSettingRepository.save(entity);
        return mapToResponse(savedEntity);
    }

    private WebsiteSettingEntity createDefaultSettings() {
        WebsiteSettingEntity defaultSettings = WebsiteSettingEntity.builder()
                .websiteName("28.TRAVEL")
                .phone("")
                .email("")
                .address("")
                .build();

        return websiteSettingRepository.save(defaultSettings);
    }

    private WebsiteSettingResponse mapToResponse(WebsiteSettingEntity entity) {
        return WebsiteSettingResponse.builder()
                .id(entity.getId())
                .websiteName(entity.getWebsiteName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .address(entity.getAddress())
                .build();
    }
}
