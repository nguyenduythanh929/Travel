package com.tour.travel.dto.request.websitesetting;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebsiteSettingRequest {
    private String websiteName;
    private String phone;
    private String email;
    private String address;
}
