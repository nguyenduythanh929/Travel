package com.tour.travel.dto.response.contact;

import com.tour.travel.dto.response.common.BaseResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse extends BaseResponse {
    private Integer id;
    private String email;
}
