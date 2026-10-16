package com.tour.travel.dto.response.permission;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionGroupResponse {
    private String module;
    private String moduleName;
    private List<PermissionResponse> permissions;
}
