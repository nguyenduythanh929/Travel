package com.tour.travel.Service;

import com.tour.travel.dto.request.websitesetting.WebsiteSettingRequest;
import com.tour.travel.dto.response.websitesetting.WebsiteSettingResponse;

public interface IWebsiteSettingService {
    WebsiteSettingResponse getWebsiteSettings();
    WebsiteSettingResponse updateWebsiteSettings(WebsiteSettingRequest request);
}
