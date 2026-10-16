package com.tour.travel.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chat_conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversationEntity extends BaseEntity {

    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user_message", columnDefinition = "TEXT")
    private String userMessage;

    @Column(name = "bot_response", columnDefinition = "TEXT")
    private String botResponse;

    @Column(name = "recommended_tour_ids")
    private String recommendedTourIds;
}
