package com.tour.travel.Service;

import com.tour.travel.dto.request.checkout.CheckoutRequest;
import com.tour.travel.dto.response.checkout.CheckoutResponse;
import jakarta.servlet.http.HttpServletRequest;


public interface ICheckoutService {


    CheckoutResponse checkout(CheckoutRequest request, HttpServletRequest httpRequest);

    CheckoutResponse getCheckoutSummary(CheckoutRequest request);
}
