package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    private Integer gender;

    @Column(unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(length = 1000)
    private String avatar;

    @Column(name = "image_name", length = 500)
    private String imageName;

    @Column(length = 255)
    private String address;

    @Column(name = "phone", length = 255)
    private String phone;

    @Column(name = "birthdate", length = 255)
    private String birthdate;

    private Integer status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "role_id", nullable = false))
    private Set<RoleEntity> roles = new HashSet<>();
}
