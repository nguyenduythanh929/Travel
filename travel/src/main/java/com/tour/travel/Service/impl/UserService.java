package com.tour.travel.Service.impl;

import com.tour.travel.Converter.UserConverter;
import com.tour.travel.Entity.OtpEntity;
import com.tour.travel.Entity.RoleEntity;
import com.tour.travel.Entity.UserEntity;
import com.tour.travel.Exceptions.DataNotFoundException;
import com.tour.travel.Exceptions.MyException;
import com.tour.travel.dto.request.user.*;
import com.tour.travel.dto.response.user.LoginResponse;
import com.tour.travel.dto.response.user.UserListResponse;
import com.tour.travel.dto.response.user.UserResponse;
import com.tour.travel.Repository.OtpRepository;
import com.tour.travel.Repository.RoleRepository;
import com.tour.travel.Repository.UserRepository;
import com.tour.travel.Service.IEmailService;
import com.tour.travel.Service.IUserService;
import com.tour.travel.SystemConstant.SystemConstant;
import com.tour.travel.Utils.JwtTokenUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserConverter userConverter;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final OtpRepository otpRepository;
    private final IEmailService emailService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, UserConverter userConverter,
                       JwtTokenUtil jwtTokenUtil, AuthenticationManager authenticationManager,
                       OtpRepository otpRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userConverter = userConverter;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    @Override
    public LoginResponse login(String email, String password) throws Exception {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new DataNotFoundException("Invalid email or password");
        }

        UserEntity user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        String token = jwtTokenUtil.generateToken(user);

        RoleEntity role = user.getRoles().stream().findFirst().orElse(null);

        return LoginResponse.builder()
                .userId(user.getId())
                .token(token)
                .roleName(role != null ? role.getName() : null)
                .roleCode(role != null ? role.getCode() : null)
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(UserRegisterRequest request) throws Exception {
        if (userRepository.findOneByEmailAndStatus(request.getEmail(), 1) != null) {
            throw new Exception("Email already exists");
        }

        RoleEntity role = roleRepository.findOneByCode("USER");
        UserEntity user = userConverter.toEntity(request);
        user.setRoles(Set.of(role));
        user.setStatus(1);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        UserEntity savedUser = userRepository.save(user);
        return userConverter.toResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        RoleEntity role = request.getRoleId() != null
                ? roleRepository.findById(request.getRoleId()).orElse(roleRepository.findOneByCode("USER"))
                : roleRepository.findOneByCode("USER");

        UserEntity user = userConverter.toEntity(request);
        user.setRoles(Set.of(role));
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        UserEntity savedUser = userRepository.save(user);
        return userConverter.toResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Integer id, UserUpdateRequest request) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getBirthdate() != null) user.setBirthdate(request.getBirthdate());
        if (request.getStatus() != null) user.setStatus(request.getStatus());

        if (request.getRoleId() != null) {
            RoleEntity role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRoles(Set.of(role));
        }

        UserEntity savedUser = userRepository.save(user);
        return userConverter.toResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(Integer id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userConverter.toResponse(user);
    }

    @Override
    @Transactional
    public void delete(int[] ids) {
        for (int id : ids) {
            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setStatus(0);
            userRepository.save(user);
        }
    }

    @Override
    public UserListResponse getAllUsers(int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<UserEntity> userPage = userRepository.findAll(pageRequest);
        return buildUserListResponse(userPage);
    }

    @Override
    public UserListResponse searchUsers(UserFilterRequest request, int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit, Sort.by("createdAt").descending());
        Page<UserEntity> userPage = userRepository.searchUsersWithFilters(
                request.getKeyword(),
                request.getStatus(),
                request.getFromDate(),
                request.getToDate(),
                request.getIsAdmin(),
                pageRequest
        );
        return buildUserListResponse(userPage);
    }

    @Override
    public UserListResponse getUsersByRoleCode(String roleCode, String keyword, int offset, int limit) {
        PageRequest pageRequest = PageRequest.of(offset, limit);
        Page<UserEntity> userPage = userRepository.findByRoleCode(roleCode, keyword, 1, pageRequest);
        return buildUserListResponse(userPage);
    }

    @Override
    @Transactional
    public void changePassword(int id, ChangePasswordRequest request) throws MyException {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new MyException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void sendPasswordResetOtp(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user.getStatus() == 0) {
            throw new RuntimeException("Account is disabled");
        }

        otpRepository.deleteByEmail(email);

        String otpCode = generateOtpCode();
        OtpEntity otp = new OtpEntity();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otp.setIsUsed(false);
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return otpRepository.findByEmailAndOtpCodeAndIsUsedFalseAndExpiryTimeAfter(
                email, otp, LocalDateTime.now()
        ).isPresent();
    }

    @Override
    @Transactional
    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        OtpEntity otpEntity = otpRepository.findByEmailAndOtpCodeAndIsUsedFalseAndExpiryTimeAfter(
                email, otp, LocalDateTime.now()
        ).orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpEntity.setIsUsed(true);
        otpRepository.save(otpEntity);

        emailService.sendPasswordResetConfirmation(email);
    }

    private UserListResponse buildUserListResponse(Page<UserEntity> userPage) {
        List<UserResponse> users = userPage.getContent().stream()
                .map(userConverter::toResponse)
                .collect(Collectors.toList());

        return UserListResponse.builder()
                .users(users)
                .currentPage(userPage.getNumber())
                .totalItems(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .pageSize(userPage.getSize())
                .build();
    }

    private String generateOtpCode() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
