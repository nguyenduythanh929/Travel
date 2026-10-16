package com.tour.travel.dto.response.websitesetting;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebsiteSettingResponse {
    private Long id;
    private String websiteName;
    private String phone;
    private String email;
    private String address;
}
