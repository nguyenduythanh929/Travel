package com.tour.travel.Converter;

import com.tour.travel.Entity.RoleEntity;
import com.tour.travel.Entity.UserEntity;
import com.tour.travel.dto.request.user.UserCreateRequest;
import com.tour.travel.dto.request.user.UserRegisterRequest;
import com.tour.travel.dto.response.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class UserConverter {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public UserResponse toResponse(UserEntity entity) {
        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .birthdate(entity.getBirthdate())
                .avatar(entity.getAvatar())
                .status(entity.getStatus());

        if (entity.getRoles() != null && !entity.getRoles().isEmpty()) {
            RoleEntity role = entity.getRoles().iterator().next();
            builder.roleId(role.getId())
                    .roleName(role.getName())
                    .roleCode(role.getCode());
        }

        if (entity.getCreatedAt() != null) {
            builder.createdAt(entity.getCreatedAt().format(DATE_FORMATTER));
        }
        if (entity.getUpdatedAt() != null) {
            builder.updatedAt(entity.getUpdatedAt().format(DATE_FORMATTER));
        }

        return builder.build();
    }

    public UserEntity toEntity(UserRegisterRequest request) {
        UserEntity entity = new UserEntity();
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        return entity;
    }

    public UserEntity toEntity(UserCreateRequest request) {
        UserEntity entity = new UserEntity();
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setAddress(request.getAddress());
        entity.setBirthdate(request.getBirthdate());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        return entity;
    }
}
