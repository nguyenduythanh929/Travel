package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactEntity extends BaseEntity {
    @Column(nullable = false, length = 255)
    private String email;
    private Integer status = 1;
}
