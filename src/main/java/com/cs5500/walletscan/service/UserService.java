package com.cs5500.walletscan.service;

import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.UserDto;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface UserService {
    ResponseDto signUp(ResponseDto signupRequest);

    ResponseDto signIn(ResponseDto signinRequest);

    ResponseDto updateUserSettings(Long userId, UserDto userDto);
    ResponseDto updateProfileImage(Long userId, UserDto userDto);

    ResponseDto updateUserPassword(Long userId, String oldPassword, String newPassword);

}
