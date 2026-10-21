package com.tour.travel.Service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tour.travel.Configurations.GeminiApiConfig;
import com.tour.travel.Entity.ChatConversationEntity;
import okhttp3.Request;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Protocol;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChatbotServiceGeminiApiTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatbotService chatbotService =
        new ChatbotService(null, null, null, null, null, objectMapper);

    @Test
    void buildsGenerateContentEndpointWithoutDuplicatePathOrKey() {
        assertEquals(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            ChatbotService.buildGeminiEndpoint(
                "https://generativelanguage.googleapis.com/v1beta/",
                "gemini-2.5-flash"
            )
        );
    }

    @Test
    void sendsApiKeyInHeaderAndNotInUrl() {
        ObjectNode body = objectMapper.createObjectNode();
        body.putArray("contents");

        Request request = ChatbotService.buildGeminiHttpRequest(
            "https://generativelanguage.googleapis.com/v1beta",
            "gemini-2.5-flash",
            "test-api-key",
            body
        );

        assertEquals("POST", request.method());
        assertEquals("test-api-key", request.header("x-goog-api-key"));
        assertFalse(request.url().toString().contains("test-api-key"));
    }

    @Test
    void retriesOnlyTransientGeminiStatusesWithBoundedBackoff() {
        assertTrue(ChatbotService.isRetryableGeminiStatus(429));
        assertTrue(ChatbotService.isRetryableGeminiStatus(503));
        assertTrue(ChatbotService.isRetryableGeminiStatus(599));
        assertFalse(ChatbotService.isRetryableGeminiStatus(400));
        assertFalse(ChatbotService.isRetryableGeminiStatus(404));
        assertEquals(250, ChatbotService.retryDelayMillis(1, 0));
        assertEquals(750, ChatbotService.retryDelayMillis(2, 250));
        assertEquals(1250, ChatbotService.retryDelayMillis(3, 250));
        assertEquals(1250, ChatbotService.retryDelayMillis(10, 250));
        assertEquals(3, ChatbotService.MAX_GEMINI_ATTEMPTS);
    }

    @Test
    void retriesTransientHttpResponsesAndStopsAfterSuccess() throws IOException {
        ChatbotService service = newChatbotService();
        AtomicInteger calls = new AtomicInteger();
        OkHttpClient client = new OkHttpClient.Builder()
            .addInterceptor(chain -> {
                int attempt = calls.incrementAndGet();
                int status = attempt == 1 ? 503 : attempt == 2 ? 429 : 200;
                return response(chain.request(), status);
            })
            .build();

        try (Response response = service.executeGeminiRequest(testRequest(), client)) {
            assertEquals(200, response.code());
        }
        assertEquals(3, calls.get());
    }

    @Test
    void doesNotRetryClientErrorsAndCapsTransientRetries() throws IOException {
        ChatbotService service = newChatbotService();
        AtomicInteger clientErrorCalls = new AtomicInteger();
        OkHttpClient clientErrorClient = new OkHttpClient.Builder()
            .addInterceptor(chain -> {
                clientErrorCalls.incrementAndGet();
                return response(chain.request(), 400);
            })
            .build();

        try (Response response = service.executeGeminiRequest(testRequest(), clientErrorClient)) {
            assertEquals(400, response.code());
        }
        assertEquals(1, clientErrorCalls.get());

        AtomicInteger transientCalls = new AtomicInteger();
        OkHttpClient transientClient = new OkHttpClient.Builder()
            .addInterceptor(chain -> {
                transientCalls.incrementAndGet();
                return response(chain.request(), 503);
            })
            .build();
        try (Response response = service.executeGeminiRequest(testRequest(), transientClient)) {
            assertEquals(503, response.code());
        }
        assertEquals(ChatbotService.MAX_GEMINI_ATTEMPTS, transientCalls.get());
    }

    private ChatbotService newChatbotService() {
        GeminiApiConfig config = mock(GeminiApiConfig.class);
        when(config.getModel()).thenReturn("gemini-2.5-flash");
        return new ChatbotService(config, null, null, null, null, objectMapper);
    }

    private Request testRequest() {
        return new Request.Builder().url("https://example.test/generate").build();
    }

    private Response response(okhttp3.Request request, int status) {
        return new Response.Builder()
            .request(request)
            .protocol(Protocol.HTTP_1_1)
            .code(status)
            .message("test")
            .body(ResponseBody.create("", MediaType.get("text/plain")))
            .build();
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
