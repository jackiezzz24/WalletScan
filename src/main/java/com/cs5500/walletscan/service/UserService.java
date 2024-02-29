package com.cs5500.walletscan.service;

import com.cs5500.walletscan.dto.LoginDto;
import com.cs5500.walletscan.dto.UserDto;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.responseModels.LoginResponse;

public interface UserService {
    User addUser(UserDto userDto);

    LoginResponse loginUser(LoginDto loginDto);
}
