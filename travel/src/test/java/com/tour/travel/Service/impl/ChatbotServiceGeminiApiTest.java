package com.tour.travel.Service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tour.travel.Entity.ChatConversationEntity;
import okhttp3.Request;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class ChatbotServiceGeminiApiTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatbotService chatbotService =
        new ChatbotService(null, null, null, null, null, objectMapper);

    @Test
    void buildsGenerateContentEndpointWithoutDuplicatePathOrKey() {
        assertEquals(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            ChatbotService.buildGeminiEndpoint(
                "https://generativelanguage.googleapis.com/v1beta/",
                "gemini-3.8-flash"
            )
        );
    }

    @Test
    void sendsApiKeyInHeaderAndNotInUrl() {
        ObjectNode body = objectMapper.createObjectNode();
        body.putArray("contents");

        Request request = ChatbotService.buildGeminiHttpRequest(
            "https://generativelanguage.googleapis.com/v1beta",
            "gemini-3.8-flash",
            "test-api-key",
            body
        );

        assertEquals("POST", request.method());
        assertEquals("test-api-key", request.header("x-goog-api-key"));
        assertFalse(request.url().toString().contains("test-api-key"));
    }

    @Test
    void buildsRequestWithSystemInstructionAndAlternatingHistoryRoles() {
        ChatConversationEntity previous = new ChatConversationEntity();
        previous.setUserMessage("Find a beach trip.");
        previous.setBotResponse("Consider the coastal tour.");

        JsonNode request = chatbotService.buildGeminiRequestBody(
            "What is the price?",
            List.of(previous),
            "Recommend relevant tours."
        );

        assertEquals("Recommend relevant tours.", request.path("system_instruction").path("parts").get(0).path("text").asText());
        assertEquals("user", request.path("contents").get(0).path("role").asText());
        assertEquals("Find a beach trip.", request.path("contents").get(0).path("parts").get(0).path("text").asText());
        assertEquals("model", request.path("contents").get(1).path("role").asText());
        assertEquals("Consider the coastal tour.", request.path("contents").get(1).path("parts").get(0).path("text").asText());
        assertEquals("user", request.path("contents").get(2).path("role").asText());
        assertEquals("What is the price?", request.path("contents").get(2).path("parts").get(0).path("text").asText());
        assertEquals(0.7, request.path("generationConfig").path("temperature").asDouble());
        assertEquals(2048, request.path("generationConfig").path("maxOutputTokens").asInt());
        assertFalse(request.has("key"));
    }

    @Test
    void parsesGeneratedTextAndReturnsSafeMessageForMissingOrBlockedOutput() throws IOException {
        assertEquals(
            "Hello there!",
            ChatbotService.parseGeminiResponse(
                """
                    {"candidates":[{"content":{"parts":[{"text":"Hello"},{"text":" there!"}]}}]}
                    """,
                objectMapper
            )
        );
        assertEquals(
            "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
            ChatbotService.parseGeminiResponse("{\"candidates\":[]}", objectMapper)
        );
        assertEquals(
            "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
            ChatbotService.parseGeminiResponse("", objectMapper)
        );
        assertEquals(
            "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
            ChatbotService.parseGeminiResponse(
                "{\"candidates\":[{\"content\":{\"parts\":[{}]}}]}",
                objectMapper
            )
        );
        assertEquals(
            "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
            ChatbotService.parseGeminiResponse(
                "{\"promptFeedback\":{\"blockReason\":\"SAFETY\"}}",
                objectMapper
            )
        );
    }
}
