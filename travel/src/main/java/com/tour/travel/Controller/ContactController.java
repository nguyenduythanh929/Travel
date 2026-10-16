package com.tour.travel.Controller;

import com.tour.travel.dto.request.contact.ContactFilterRequest;
import com.tour.travel.dto.request.contact.ContactRequest;
import com.tour.travel.dto.response.contact.ContactListResponse;
import com.tour.travel.dto.response.contact.ContactResponse;
import com.tour.travel.Service.IContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final IContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.createContact(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ContactListResponse> getContacts(
            @ModelAttribute ContactFilterRequest filter,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit
    ) {
        ContactListResponse response = contactService.getContacts(filter, offset, limit);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{ids}")
    public ResponseEntity<Map<String, String>> deleteMultipleContacts(
            @PathVariable List<Integer> ids
    ) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Danh sách ID không được rỗng"));
        }
        contactService.deleteMultipleContacts(ids);
        return ResponseEntity.ok(Map.of(
                "message", "Xóa thành công " + ids.size() + " liên hệ"
        ));
    }
}
