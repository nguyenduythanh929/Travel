package com.tour.travel.Service;

import com.tour.travel.Entity.BookingEntity;


public interface INotificationService {


    void notifyAdminsNewBooking(BookingEntity booking);


    void notifyUserBookingStatusChange(BookingEntity booking, String message);

    void notifyUserPaymentConfirmed(BookingEntity booking, String staffUsername);

    void notifyUserBookingCancelled(BookingEntity booking, String reason, String cancelledBy);

    void notifyUserBookingExpired(BookingEntity booking);

    void notifyUserBookingCompleted(BookingEntity booking);
}
