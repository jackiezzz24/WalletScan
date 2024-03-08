package com.cs5500.walletscan.service;

import com.cs5500.walletscan.dto.ResponseDto;

public interface UserService {
    ResponseDto signUp(ResponseDto signupRequest);

    ResponseDto signIn(ResponseDto signinRequest);
}
