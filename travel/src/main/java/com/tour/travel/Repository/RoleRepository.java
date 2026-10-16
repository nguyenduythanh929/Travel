package com.tour.travel.Repository;


import com.tour.travel.Entity.RoleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity,Integer> {
	RoleEntity findOneByCode(String code);
	Page<RoleEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
