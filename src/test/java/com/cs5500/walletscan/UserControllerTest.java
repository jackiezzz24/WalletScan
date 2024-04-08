package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.JWTUtils;
import com.cs5500.walletscan.controller.UserController;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.UserDto;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.repository.UserRepository;
import com.cs5500.walletscan.service.UserService;
import com.cs5500.walletscan.service.impl.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @InjectMocks
    private UserController userController;



    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testSignUp_ValidRequest_Success() {
        ResponseDto signUpRequest = new ResponseDto();

        ResponseDto response = new ResponseDto();
        response.setStatusCode(200);

        when(userService.signUp(any(ResponseDto.class))).thenReturn(response);

        ResponseEntity<ResponseDto> result = userController.signUp(signUpRequest);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(response, result.getBody());
    }

    @Test
    void testSignIn_ValidRequest_Success() {
        ResponseDto signInRequest = new ResponseDto();
        signInRequest.setStatusCode(200);

        ResponseDto responseDto = new ResponseDto();
        responseDto.setStatusCode(200);
        responseDto.setMessage("User signed in successfully");

        when(userService.signIn(any())).thenReturn(responseDto);

        ResponseEntity<ResponseDto> responseEntity = userController.signIn(signInRequest);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(responseDto, responseEntity.getBody());
    }

    @Test
    void testGetCurrentUserProfile_AuthenticatedUser_ReturnsUserProfile() {
        String username = "testUser";
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));

        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(username)
                .password("password")
                .roles("USER")
                .build();
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails,
                null,
                userDetails.getAuthorities());
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<User> result = userController.getCurrentUserProfile();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(mockUser, result.getBody());
        assertNull(Objects.requireNonNull(result.getBody()).getPassword());
    }


    @Test
    void testGetCurrentUserProfile_AuthenticatedUser_Unauthorized() {
        SecurityContextHolder.getContext().setAuthentication(null);

        ResponseEntity<User> responseEntity = userController.getCurrentUserProfile();

        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }

    @Test
    void testUpdateUser_ValidRequest_Success() {
        ResponseDto response = new ResponseDto();
        response.setStatusCode(200);
        response.setMessage("User settings updated successfully");
        when(userService.updateUserSettings(anyLong(), any(UserDto.class))).thenReturn(response);

        ResponseEntity<ResponseDto> result = userController.updateUser(1L, new UserDto());

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(response, result.getBody());
    }

    @Test
    void testUpdatePassword_ValidRequest_Success() {
        ResponseDto response = new ResponseDto();
        response.setStatusCode(200);
        response.setMessage("Password updated successfully");
        when(userService.updateUserPassword(anyLong(), anyString(), anyString())).thenReturn(response);

        ResponseEntity<ResponseDto> result = userController.updatePassword(1L, "oldPassword", "newPassword");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(response, result.getBody());
    }

    @Test
    void testUpdateProfileImage_ValidRequest_Success() {
        ResponseDto response = new ResponseDto();
        response.setStatusCode(200);
        response.setMessage("Profile image updated successfully");
        when(userService.updateProfileImage(anyLong(), any(UserDto.class))).thenReturn(response);

        ResponseEntity<ResponseDto> result = userController.updateProfileImage(1L, new UserDto());

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(response, result.getBody());
    }
}

