package com.cs5500.walletscan.service.impl;

import com.cs5500.walletscan.Utils.JWTUtils;
import com.cs5500.walletscan.dto.ReqRes;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.repository.UserRepository;
import com.cs5500.walletscan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import static com.cs5500.walletscan.Utils.ValidationUtils.isValidEmail;
import static com.cs5500.walletscan.Utils.ValidationUtils.isValidPassword;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public ReqRes signUp(ReqRes signupRequest){
        ReqRes response = new ReqRes();
        try {
            String email = signupRequest.getEmail();
            String password = signupRequest.getPassword();

            // Add email validation
            if (!isValidEmail(email)) {
                response.setStatusCode(400);
                response.setError("Invalid email format");
                return response;
            }

            // Add password length validation
            if (!isValidPassword(password)) {
                response.setStatusCode(400);
                response.setError("Password must be more than 6 characters");
                return response;
            }

            User user = new User();
            user.setUsername(signupRequest.getUsername());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setBudget("0");
            user.setCurrency("USD");
            user.setNotification(true);
            user.setSubscribe(true);
            User savedUser = userRepository.save(user);
            if (savedUser.getId() > 0) {
                response.setUser(savedUser);
                response.setMessage("User Sign-Up Successfully");
                response.setStatusCode(200);
            }
        }catch (Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public ReqRes signIn(ReqRes signinRequest){
        ReqRes response = new ReqRes();

        try {
            String email = signinRequest.getEmail();
            String password = signinRequest.getPassword();

            // Add email validation
            if (!isValidEmail(email)) {
                response.setStatusCode(400);
                response.setError("Invalid email format");
                return response;
            }

            // Add password length validation
            if (!isValidPassword(password)) {
                response.setStatusCode(400);
                response.setError("Password must be more than 6 characters");
                return response;
            }

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            var user = userRepository.findByEmail(email).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setExpirationTime("24Hr");
            response.setMessage("Successfully Signed In");
        } catch (Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }
}
