package com.tour.travel.Service.impl;

import com.tour.travel.Entity.ContactEntity;
import com.tour.travel.dto.request.contact.ContactFilterRequest;
import com.tour.travel.dto.request.contact.ContactRequest;
import com.tour.travel.dto.response.contact.ContactListResponse;
import com.tour.travel.dto.response.contact.ContactResponse;
import com.tour.travel.Repository.ContactRepository;
import com.tour.travel.Service.IContactService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService implements IContactService {

    private final ContactRepository contactRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ContactResponse createContact(ContactRequest request) {
        ContactEntity contact = new ContactEntity();
        contact.setEmail(request.getEmail());
        ContactEntity saved = contactRepository.save(contact);
        return mapToResponse(saved);
    }

    @Override
    public ContactListResponse getContacts(ContactFilterRequest filter, int offset, int limit) {
        Pageable pageable = PageRequest.of(offset, limit);
        Page<ContactEntity> page = contactRepository.searchContacts(
                filter.getKeyword(),
                filter.getStartDate(),
                filter.getEndDate(),
                pageable
        );
        List<ContactResponse> contacts = page.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ContactListResponse(
                contacts,
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );
    }

    @Override
    @Transactional
    public void deleteMultipleContacts(List<Integer> ids) {
        contactRepository.deleteAllById(ids);
    }

    private ContactResponse mapToResponse(ContactEntity entity) {
        return modelMapper.map(entity, ContactResponse.class);
    }
}
