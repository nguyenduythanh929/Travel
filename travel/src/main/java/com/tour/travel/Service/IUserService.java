package com.tour.travel.Service;

import com.tour.travel.Exceptions.MyException;
import com.tour.travel.dto.request.user.*;
import com.tour.travel.dto.response.user.LoginResponse;
import com.tour.travel.dto.response.user.UserListResponse;
import com.tour.travel.dto.response.user.UserResponse;

public interface IUserService {

    // Authentication
    LoginResponse login(String email, String password) throws Exception;

    // User CRUD
    UserResponse register(UserRegisterRequest request) throws Exception;
    UserResponse createUser(UserCreateRequest request);
    UserResponse updateUser(Integer id, UserUpdateRequest request);
    UserResponse getUserById(Integer id);
    void delete(int[] ids);

    // User queries
    UserListResponse getAllUsers(int offset, int limit);
    UserListResponse searchUsers(UserFilterRequest request, int offset, int limit);
    UserListResponse getUsersByRoleCode(String roleCode, String keyword, int offset, int limit);

    // Password management
    void changePassword(int id, ChangePasswordRequest request) throws MyException;
    void sendPasswordResetOtp(String email);
    boolean verifyOtp(String email, String otp);
    void resetPasswordWithOtp(String email, String otp, String newPassword);
}
