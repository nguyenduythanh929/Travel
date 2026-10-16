package com.tour.travel.dto.response.chatbot;

import com.tour.travel.dto.response.tour.TourResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotResponse {
    private String message;
    private String sessionId;
    private List<TourResponse> recommendedTours;
}
