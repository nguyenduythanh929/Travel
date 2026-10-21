package com.tour.travel.Converter;

import com.tour.travel.Entity.BookingEntity;
import com.tour.travel.Entity.BookingItemEntity;
import com.tour.travel.Entity.TourEntity;
import com.tour.travel.dto.request.booking.BookingItemRequest;
import com.tour.travel.dto.response.booking.BookingItemResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class BookingItemConverter {

    public BookingItemEntity toEntity(BookingItemRequest request, TourEntity tour, BookingEntity booking) {
        BookingItemEntity item = new BookingItemEntity();
        item.setBooking(booking);
        item.setTour(tour);

        int adultCount = request.getAdultCount() != null ? request.getAdultCount() : 0;
        int childCount = request.getChildCount() != null ? request.getChildCount() : 0;
        int infantCount = request.getInfantCount() != null ? request.getInfantCount() : 0;

        item.setAdultCount(adultCount);
        item.setChildCount(childCount);
        item.setInfantCount(infantCount);
        item.setDepartureLocation(request.getDepartureLocation());

        double priceAdult = tour.getPriceAdult() != null ? tour.getPriceAdult() : 0.0;
        double priceChild = tour.getPriceChild() != null ? tour.getPriceChild() : 0.0;
        double priceInfant = tour.getPriceInfant() != null ? tour.getPriceInfant() : 0.0;

        item.setPriceAdult(priceAdult);
        item.setPriceChild(priceChild);
        item.setPriceInfant(priceInfant);

        double subtotal = priceAdult * adultCount + priceChild * childCount + priceInfant * infantCount;
        item.setSubtotal(subtotal);

        return item;
    }

    public BookingItemResponse toResponse(BookingItemEntity item) {
        if (item == null) return null;

        TourEntity tour = item.getTour();

        LocalDate departureDate = item.getDepartureDate();
        if (departureDate == null && tour != null && tour.getDepartureDates() != null && !tour.getDepartureDates().isEmpty()) {
            departureDate = tour.getDepartureDates().get(0).getDate();
        }

        return BookingItemResponse.builder()
                .id(item.getId())
                .tourId(tour != null ? tour.getId() : null)
                .tourName(tour != null ? tour.getName() : null)
                .tourImage(tour != null ? tour.getAvatar() : null)
                .departureLocation(item.getDepartureLocation())
                .departureDate(departureDate)
                .adultCount(item.getAdultCount() != null ? item.getAdultCount() : 0)
                .childCount(item.getChildCount() != null ? item.getChildCount() : 0)
                .infantCount(item.getInfantCount() != null ? item.getInfantCount() : 0)
                .pricePerAdult(tour != null && tour.getPriceAdult() != null ? tour.getPriceAdult() : 0.0)
                .pricePerChild(tour != null && tour.getPriceChild() != null ? tour.getPriceChild() : 0.0)
                .pricePerInfant(tour != null && tour.getPriceInfant() != null ? tour.getPriceInfant() : 0.0)
                .subTotal(item.getSubtotal() != null ? item.getSubtotal() : 0.0)
                .build();
    }
}
