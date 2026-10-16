package com.tour.travel.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserListResponse {
    private List<UserResponse> users;
    private Integer currentPage;
    private Long totalItems;
    private Integer totalPages;
    private Integer pageSize;
}
