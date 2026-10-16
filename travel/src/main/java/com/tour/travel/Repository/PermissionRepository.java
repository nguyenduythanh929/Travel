package com.tour.travel.Repository;

import com.tour.travel.Entity.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<PermissionEntity, Integer> {

    Optional<PermissionEntity> findByCode(String code);

    List<PermissionEntity> findByModule(String module);

    List<PermissionEntity> findAllByOrderByModuleAscCodeAsc();

    List<PermissionEntity> findByIdIn(List<Integer> ids);

}
