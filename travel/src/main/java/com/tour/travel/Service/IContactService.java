package com.tour.travel.Service;

import com.tour.travel.dto.request.contact.ContactFilterRequest;
import com.tour.travel.dto.request.contact.ContactRequest;
import com.tour.travel.dto.response.contact.ContactListResponse;
import com.tour.travel.dto.response.contact.ContactResponse;

import java.util.List;

public interface IContactService {
    ContactResponse createContact(ContactRequest request);
    ContactListResponse getContacts(ContactFilterRequest filter, int offset, int limit);
    void deleteMultipleContacts(List<Integer> ids);
}