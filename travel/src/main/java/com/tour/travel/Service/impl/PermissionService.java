package com.tour.travel.Service.impl;

import com.tour.travel.Entity.PermissionEntity;
import com.tour.travel.dto.response.permission.PermissionGroupResponse;
import com.tour.travel.dto.response.permission.PermissionResponse;
import com.tour.travel.Repository.PermissionRepository;
import com.tour.travel.Service.IPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService implements IPermissionService {

    private final PermissionRepository permissionRepository;

    private static final Map<String, String> MODULE_NAMES = new LinkedHashMap<>() {{
        put("DASHBOARD", "Tổng quan");
        put("TOUR_TYPE", "Danh mục");
        put("TOUR", "Tour");
        put("BOOKING", "Đơn đặt");
        put("USER", "Người dùng");
        put("ROLE", "Nhóm quyền");
        put("VOUCHER", "Voucher");
        put("CONTACT", "Liên hệ");
        put("REVIEW", "Đánh giá");
    }};

    @Override
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAllByOrderByModuleAscCodeAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PermissionGroupResponse> getPermissionsGroupedByModule() {
        List<PermissionEntity> allPermissions = permissionRepository.findAllByOrderByModuleAscCodeAsc();

        Map<String, List<PermissionEntity>> groupedMap = allPermissions.stream()
                .collect(Collectors.groupingBy(
                        PermissionEntity::getModule,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<PermissionGroupResponse> result = new ArrayList<>();
        for (Map.Entry<String, List<PermissionEntity>> entry : groupedMap.entrySet()) {
            String module = entry.getKey();
            List<PermissionResponse> permissions = entry.getValue().stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            result.add(PermissionGroupResponse.builder()
                    .module(module)
                    .moduleName(MODULE_NAMES.getOrDefault(module, module))
                    .permissions(permissions)
                    .build());
        }

        return result;
    }

    private PermissionResponse toResponse(PermissionEntity entity) {
        return PermissionResponse.builder()
                .id(Long.valueOf(entity.getId()))
                .code(entity.getCode())
                .name(entity.getName())
                .module(entity.getModule())
                .description(entity.getDescription())
                .build();
    }
}
