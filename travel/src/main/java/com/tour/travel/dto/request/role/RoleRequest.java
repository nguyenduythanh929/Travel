package com.tour.travel.dto.request.role;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleRequest {
    private String name;
    private String code;
    private String description;
    private List<Long> permissionIds;
}
