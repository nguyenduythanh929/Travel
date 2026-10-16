package com.tour.travel.Repository;

import com.tour.travel.Entity.BookingItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingItemRepository extends JpaRepository<BookingItemEntity, Integer> {
    List<BookingItemEntity> findByBooking_Id(Integer bookingId);
}
