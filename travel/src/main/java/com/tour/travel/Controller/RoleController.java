package com.tour.travel.Controller;

import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.request.role.RoleRequest;
import com.tour.travel.dto.response.permission.PermissionGroupResponse;
import com.tour.travel.dto.response.role.RoleListResponse;
import com.tour.travel.dto.response.role.RoleResponse;
import com.tour.travel.Service.IPermissionService;
import com.tour.travel.Service.impl.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    private final IPermissionService permissionService;


    @GetMapping("/permissions")
    public ResponseEntity<List<PermissionGroupResponse>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getPermissionsGroupedByModule());
    }

    @GetMapping
    public ResponseEntity<RoleListResponse> getAllRoles(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").descending());
        return ResponseEntity.ok(roleService.getAllRoles(keyword, pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Integer id) throws DataNotFoundException {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.createRole(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable Integer id,
            @RequestBody RoleRequest request
    ) throws DataNotFoundException {
        return ResponseEntity.ok(roleService.updateRole(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) throws DataNotFoundException {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteMultipleRoles(@RequestParam List<Integer> ids) {
        roleService.deleteMultipleRoles(ids);
        return ResponseEntity.noContent().build();
    }
}