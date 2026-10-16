package com.tour.travel.Controller;

import com.tour.travel.Entity.ChatConversationEntity;
import com.tour.travel.dto.request.chatbot.ChatbotRequest;
import com.tour.travel.dto.response.chatbot.ChatbotResponse;
import com.tour.travel.Service.impl.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<ChatbotResponse> chat(@RequestBody ChatbotRequest request) {
        try {
            ChatbotResponse response = chatbotService.chat(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ChatbotResponse.builder()
                    .message("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.")
                    .sessionId(request.getSessionId())
                    .build());
        }
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatConversationEntity>> getConversationHistory(
        @PathVariable String sessionId) {
        try {
            List<ChatConversationEntity> history = chatbotService.getConversationHistory(sessionId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user-conversations/{userId}")
    public ResponseEntity<List<ChatConversationEntity>> getUserConversations(
        @PathVariable Integer userId) {
        try {
            List<ChatConversationEntity> conversations = chatbotService.getUserConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
