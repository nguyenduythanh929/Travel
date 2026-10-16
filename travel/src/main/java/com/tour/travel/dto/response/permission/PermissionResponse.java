package com.tour.travel.dto.response.permission;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionResponse {
    private Long id;
    private String code;
    private String name;
    private String module;
    private String description;
}
