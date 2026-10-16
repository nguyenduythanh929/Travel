package com.tour.travel.Converter;

import com.tour.travel.Entity.RoleEntity;
import com.tour.travel.dto.role.RoleDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoleConverter {

    @Autowired
    private ModelMapper modelMapper;

    public RoleDTO convertToDto(RoleEntity entity) {
        return modelMapper.map(entity, RoleDTO.class);
    }

    public RoleEntity convertToEntity(RoleDTO dto) {
        return modelMapper.map(dto, RoleEntity.class);
    }
}
