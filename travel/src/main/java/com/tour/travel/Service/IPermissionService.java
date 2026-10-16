package com.tour.travel.Service;

import com.tour.travel.dto.response.permission.PermissionGroupResponse;
import com.tour.travel.dto.response.permission.PermissionResponse;

import java.util.List;

public interface IPermissionService {
    List<PermissionResponse> getAllPermissions();
    List<PermissionGroupResponse> getPermissionsGroupedByModule();
}
