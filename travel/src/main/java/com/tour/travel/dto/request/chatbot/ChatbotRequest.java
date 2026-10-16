package com.tour.travel.dto.request.chatbot;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotRequest {
    private String message;
    private String sessionId;
    private Integer userId;
}
