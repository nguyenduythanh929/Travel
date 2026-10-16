package com.tour.travel.dto.response.role;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleListResponse {
    private List<RoleResponse> roles;
    private int totalPages;
    private long totalItems;
    private int page;
    private int limit;
}
