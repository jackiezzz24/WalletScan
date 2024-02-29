package com.cs5500.walletscan.service.impl;

import com.cs5500.walletscan.dto.LoginDto;
import com.cs5500.walletscan.dto.UserDto;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.repository.UserRepository;
import com.cs5500.walletscan.responseModels.LoginResponse;
import com.cs5500.walletscan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User addUser(UserDto userDto) {
        User user = new User(
                userDto.getEmail(),
                userDto.getUsername(),
                this.passwordEncoder.encode(userDto.getPassword())
        );

        return userRepository.save(user);
    }

    @Override
    public LoginResponse loginUser(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail());
        if (user != null) {
            String password = loginDto.getPassword();
            String encodedPassword = user.getPassword();
            boolean passwordMatch = passwordEncoder.matches(password, encodedPassword);

            if (passwordMatch) {
                Optional<User> currUser = userRepository.findUserByEmailAndPassword(loginDto.getEmail(), encodedPassword);
                if (currUser.isPresent()) {
                    return new LoginResponse("Login Success", true);
                } else {
                    return new LoginResponse("Login Failed", false);
                }
            } else {
                return new LoginResponse("Password doesn't match", false);
            }
        } else {
            return new LoginResponse("Email doesn't exist", false);
        }
    }
}
