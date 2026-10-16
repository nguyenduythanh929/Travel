package com.tour.travel.Service;

import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.dto.role.RoleDTO;
import com.tour.travel.dto.request.role.RoleRequest;
import com.tour.travel.dto.response.role.RoleListResponse;
import com.tour.travel.dto.response.role.RoleResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IRoleService {
	List<RoleDTO> findAll();
	Map<String,String> getRoles();
	RoleListResponse getAllRoles(String keyword, Pageable pageable);
	RoleResponse getRoleById(Integer id) throws DataNotFoundException;
	RoleResponse createRole(RoleRequest request);
	RoleResponse updateRole(Integer id, RoleRequest request) throws DataNotFoundException;
	void deleteRole(Integer id) throws DataNotFoundException;
	void deleteMultipleRoles(List<Integer> ids);
}
