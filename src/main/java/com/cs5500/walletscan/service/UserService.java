package com.cs5500.walletscan.service;

import com.cs5500.walletscan.Dto.UserDto;
import com.cs5500.walletscan.entity.User;

import java.util.List;

public interface UserService {
    void registerUser(UserDto userDto);

    User findUserByEmail(String email);
    List<UserDto> findAllUser();
}
