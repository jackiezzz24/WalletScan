package com.cs5500.walletscan.service;

import com.cs5500.walletscan.dto.ReqRes;

public interface UserService {
    ReqRes signUp(ReqRes signupRequest);

    ReqRes signIn(ReqRes signinRequest);
}
