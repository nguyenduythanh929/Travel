package com.tour.travel.dto.request.user;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String address;
    private String birthdate;
    private Integer roleId;
    private Integer status;
}
