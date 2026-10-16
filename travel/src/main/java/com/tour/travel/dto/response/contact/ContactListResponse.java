package com.tour.travel.dto.response.contact;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactListResponse {
    private List<ContactResponse> data;
    @JsonProperty("total_items")
    private Long totalItems;
    @JsonProperty("total_pages")
    private Integer totalPages;
    @JsonProperty("current_page")
    private Integer currentPage;
    @JsonProperty("page_size")
    private Integer pageSize;
}
