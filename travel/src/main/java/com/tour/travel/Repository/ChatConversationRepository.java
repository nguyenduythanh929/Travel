package com.tour.travel.Repository;

import com.tour.travel.Entity.ChatConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatConversationRepository extends JpaRepository<ChatConversationEntity, Integer> {
    List<ChatConversationEntity> findBySessionIdOrderByCreatedAtAsc(String sessionId);
    List<ChatConversationEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
