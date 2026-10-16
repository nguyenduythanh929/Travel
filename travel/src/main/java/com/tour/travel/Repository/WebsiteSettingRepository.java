package com.tour.travel.Repository;

import com.tour.travel.Entity.WebsiteSettingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WebsiteSettingRepository extends JpaRepository<WebsiteSettingEntity, Long> {
}
