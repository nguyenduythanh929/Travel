package com.tour.travel.Service.impl;


import com.tour.travel.Converter.RoleConverter;
import com.tour.travel.Entity.PermissionEntity;
import com.tour.travel.Entity.RoleEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.role.RoleDTO;
import com.tour.travel.dto.request.role.RoleRequest;
import com.tour.travel.dto.response.permission.PermissionResponse;
import com.tour.travel.dto.response.role.RoleListResponse;
import com.tour.travel.dto.response.role.RoleResponse;
import com.tour.travel.Repository.PermissionRepository;
import com.tour.travel.Repository.RoleRepository;
import com.tour.travel.Service.IRoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private RoleConverter roleConverter;

	private final PermissionRepository permissionRepository;


	public List<RoleDTO> findAll() {
		List<RoleEntity> roleEntities = roleRepository.findAll();
		List<RoleDTO> list = new ArrayList<>();
		roleEntities.forEach(item -> {
			RoleDTO roleDTO = roleConverter.convertToDto(item);
			list.add(roleDTO);
		});
		return list;
	}

	@Override
	public Map<String, String> getRoles() {
		Map<String,String> roleTerm = new HashMap<>();
		List<RoleEntity> roleEntity = roleRepository.findAll();
		for(RoleEntity item : roleEntity){
			RoleDTO roleDTO = roleConverter.convertToDto(item);
			roleTerm.put(roleDTO.getCode(), roleDTO.getName());
		}
		return roleTerm;
	}

	public RoleListResponse getAllRoles(String keyword, Pageable pageable) {
		Page<RoleEntity> page;
		if (keyword != null && !keyword.isEmpty()) {
			page = roleRepository.findByNameContainingIgnoreCase(keyword, pageable);
		} else {
			page = roleRepository.findAll(pageable);
		}

		List<RoleResponse> roles = page.getContent().stream()
				.map(this::toRoleResponse)
				.collect(Collectors.toList());

		return RoleListResponse.builder()
				.roles(roles)
				.totalPages(page.getTotalPages())
				.totalItems(page.getTotalElements())
				.page(pageable.getPageNumber())
				.limit(pageable.getPageSize())
				.build();
	}


	public RoleResponse getRoleById(Integer id) throws DataNotFoundException {
		RoleEntity role = roleRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Không tìm thấy nhóm quyền với ID: " + id));
		return toRoleResponse(role);
	}

	@Transactional
	public RoleResponse createRole(RoleRequest request) {
		RoleEntity role = new RoleEntity();
		role.setName(request.getName());
		role.setCode(request.getCode());
		role.setDescription(request.getDescription());

		if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
			List<Integer> intIds = request.getPermissionIds().stream()
					.map(Long::intValue)
					.collect(Collectors.toList());
			List<PermissionEntity> permissions = permissionRepository.findAllById(intIds);
			role.setPermissions(new HashSet<>(permissions));
		}

		RoleEntity saved = roleRepository.save(role);
		return toRoleResponse(saved);
	}


	@Transactional
	public RoleResponse updateRole(Integer id, RoleRequest request) throws DataNotFoundException {
		RoleEntity role = roleRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Không tìm thấy nhóm quyền với ID: " + id));

		role.setName(request.getName());
		role.setCode(request.getCode());
		role.setDescription(request.getDescription());

		if (request.getPermissionIds() != null) {
			List<Integer> intIds = request.getPermissionIds().stream()
					.map(Long::intValue)
					.collect(Collectors.toList());
			List<PermissionEntity> permissions = permissionRepository.findAllById(intIds);
			role.setPermissions(new HashSet<>(permissions));
		} else {
			role.getPermissions().clear();
		}

		RoleEntity saved = roleRepository.save(role);
		return toRoleResponse(saved);
	}

	@Transactional
	public void deleteRole(Integer id) throws DataNotFoundException {
		RoleEntity role = roleRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Không tìm thấy nhóm quyền với ID: " + id));

		if (role.getUser() != null && !role.getUser().isEmpty()) {
			throw new RuntimeException("Không thể xóa nhóm quyền đang được sử dụng bởi "
					+ role.getUser().size() + " người dùng");
		}

		roleRepository.delete(role);
	}

	@Transactional
	public void deleteMultipleRoles(List<Integer> ids) {
		for (Integer id : ids) {
			try {
				deleteRole(id);
			} catch (DataNotFoundException ignored) {
			}
		}
	}


	private RoleResponse toRoleResponse(RoleEntity entity) {
		List<PermissionResponse> permissionResponses = new ArrayList<>();
		if (entity.getPermissions() != null) {
			permissionResponses = entity.getPermissions().stream()
					.map(p -> PermissionResponse.builder()
							.id(Long.valueOf(p.getId()))
							.code(p.getCode())
							.name(p.getName())
							.module(p.getModule())
							.build())
					.collect(Collectors.toList());
		}

		return RoleResponse.builder()
				.id(Long.valueOf(entity.getId()))
				.name(entity.getName())
				.code(entity.getCode())
				.description(entity.getDescription())
				.permissions(permissionResponses)
				.build();
	}
}
