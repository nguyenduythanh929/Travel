package com.tour.travel.Controller;

import com.tour.travel.Service.impl.ChatbotService;
import com.tour.travel.dto.request.chatbot.ChatbotRequest;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChatbotControllerTest {

    private final ChatbotService chatbotService = mock(ChatbotService.class);
    private final ChatbotController chatbotController = new ChatbotController(chatbotService);

    @Test
    void mapsDependencyFailuresToBadGatewayWithoutExposingInternalError() throws IOException {
        when(chatbotService.chat(org.mockito.ArgumentMatchers.any()))
            .thenThrow(new IOException("upstream failure"));

        var response = chatbotController.chat(new ChatbotRequest("Hello", null, null));

        assertEquals(502, response.getStatusCode().value());
        assertEquals("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.", response.getBody().getMessage());
    }

    @Test
    void mapsUnexpectedProcessingFailuresToInternalServerError() throws IOException {
        when(chatbotService.chat(org.mockito.ArgumentMatchers.any()))
            .thenThrow(new IllegalStateException("internal failure"));

        var response = chatbotController.chat(new ChatbotRequest("Hello", null, null));

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.", response.getBody().getMessage());
    }
}
