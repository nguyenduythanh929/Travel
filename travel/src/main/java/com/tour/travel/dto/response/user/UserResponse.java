package com.tour.travel.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String birthdate;
    private String avatar;
    private Integer status;
    private Integer roleId;
    private String roleName;
    private String roleCode;
    private String createdAt;
    private String updatedAt;
}
