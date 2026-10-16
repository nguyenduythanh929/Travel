package com.tour.travel.Controller;

import com.tour.travel.dto.request.websitesetting.WebsiteSettingRequest;
import com.tour.travel.dto.response.websitesetting.WebsiteSettingResponse;
import com.tour.travel.Service.IWebsiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/website-settings")
@RequiredArgsConstructor
public class WebsiteSettingController {

    private final IWebsiteSettingService websiteSettingService;

    @GetMapping
    public ResponseEntity<WebsiteSettingResponse> getWebsiteSettings() {
        return ResponseEntity.ok(websiteSettingService.getWebsiteSettings());
    }

    @PutMapping
    public ResponseEntity<WebsiteSettingResponse> updateWebsiteSettings(
            @RequestBody WebsiteSettingRequest request
    ) {
        return ResponseEntity.ok(websiteSettingService.updateWebsiteSettings(request));
    }
}
