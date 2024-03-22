package com.cs5500.walletscan.service.impl;

import com.cs5500.walletscan.Utils.JWTUtils;
import com.cs5500.walletscan.Utils.ValidationUtils;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.UserDto;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.repository.UserRepository;
import com.cs5500.walletscan.service.SubscribeService;
import com.cs5500.walletscan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

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
    @Autowired
    private SubscribeService subscribeService;
    @Autowired
    private ValidationUtils validationUtils;

    @Override
    public ResponseDto signUp(ResponseDto signupRequest) {
        ResponseDto response = new ResponseDto();
        try {
            String email = signupRequest.getEmail();
            String password = signupRequest.getPassword();

            // Add email validation
            if (!validationUtils.isValidEmail(email)) {
                response.setStatusCode(400);
                response.setError("Invalid email format");
                return response;
            }

            // Add password length validation
            if (validationUtils.isValidPassword(password)) {
                response.setStatusCode(400);
                response.setError("Password must be more than 6 characters");
                return response;
            }

            User user = new User();
            user.setUsername(signupRequest.getUsername());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setBudget("1000");
            user.setCurrency("USD");
            user.setNotification(true);
            user.setSubscribe(true);
            User savedUser = userRepository.save(user);
            if (savedUser.getId() > 0) {
                response.setUser(savedUser);
                response.setMessage("User Sign-Up Successfully. Please Sign-In.");
                response.setStatusCode(200);
                subscribeService.saveSubscribe(savedUser.getEmail());
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto signIn(ResponseDto signinRequest) {
        ResponseDto response = new ResponseDto();

        try {
            String password = signinRequest.getPassword();
            String username = signinRequest.getUsername();

            // Add password length validation
            if (validationUtils.isValidPassword(password)) {
                response.setStatusCode(400);
                response.setError("Password must be more than 6 characters");
                return response;
            }

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            var user = userRepository.findByUsername(username).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setUser(user);
            response.setExpirationTime("24Hr");
            response.setMessage("Successfully Signed In");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto updateUserSettings(Long userId, UserDto userDto) {
        ResponseDto response = new ResponseDto();
        try {
            User existingUser = userRepository.findById(userId).orElse(null);

            if (existingUser != null) {
                existingUser.setBudget(userDto.getBudget());
                existingUser.setCurrency(userDto.getCurrency());
                existingUser.setSubscribe(userDto.getSubscribe());
                existingUser.setNotification(userDto.getNotification());

                User savedUser = userRepository.save(existingUser);
                response.setUser(savedUser);
                response.setMessage("User Updated Successfully");
                response.setStatusCode(200);
            } else {
                response.setStatusCode(404);
                response.setError("User Not Found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto updateUserPassword(Long userId, String oldPassword, String newPassword) {
        ResponseDto response = new ResponseDto();
        try {
            User existingUser = userRepository.findById(userId).orElse(null);

            if (existingUser != null) {
                if (passwordEncoder.matches(oldPassword, existingUser.getPassword())) {
                    existingUser.setPassword(passwordEncoder.encode(newPassword));
                    User savedUser = userRepository.save(existingUser);
                    response.setUser(savedUser);
                    response.setMessage("Password Updated Successfully");
                    response.setStatusCode(200);
                } else {
                    response.setStatusCode(400);
                    response.setError("Wrong Password. Please try again");
                }
            } else {
                response.setStatusCode(404);
                response.setError("User Not Found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto updateProfileImage(Long userId, UserDto userDto) {
        ResponseDto response = new ResponseDto();
        try {
            User existingUser = userRepository.findById(userId).orElse(null);

            if (existingUser != null) {
                existingUser.setProfile_img(userDto.getProfile_img());

                User savedUser = userRepository.save(existingUser);
                response.setUser(savedUser);
                response.setMessage("Profile Image Upload Successfully");
                response.setStatusCode(200);
            } else {
                response.setStatusCode(404);
                response.setError("User Not Found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }
}
