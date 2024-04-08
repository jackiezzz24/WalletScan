package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.JWTUtils;
import com.cs5500.walletscan.Utils.ValidationUtils;
import com.cs5500.walletscan.controller.UserController;
import com.cs5500.walletscan.dto.ResponseDto;
import com.cs5500.walletscan.dto.UserDto;
import com.cs5500.walletscan.entity.User;
import com.cs5500.walletscan.repository.UserRepository;
import com.cs5500.walletscan.service.SubscribeService;
import com.cs5500.walletscan.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private SubscribeService subscribeService;

    @Mock
    private ValidationUtils validationUtils;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testSignUp_ValidUser_Success() {
        when(validationUtils.isValidEmail(any(String.class))).thenReturn(true);
        when(validationUtils.isValidPassword(any(String.class))).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setId(123L);
        savedUser.setPassword("encodedPassword");
        savedUser.setEmail("test@example.com");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        ResponseDto signupRequest = new ResponseDto();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password");
        signupRequest.setUsername("testUser");
        ResponseDto response = userService.signUp(signupRequest);

        assertEquals(200, response.getStatusCode());
        assertEquals("User Sign-Up Successfully. Please Sign-In.", response.getMessage());

        verify(subscribeService, times(1)).saveSubscribe(eq("test@example.com"));
    }

    @Test
    void testSignUp_InvalidEmail_Failure() {
        when(validationUtils.isValidEmail(any(String.class))).thenReturn(false);

        ResponseDto signUpRequest = new ResponseDto();
        signUpRequest.setEmail("invalidemail");
        ResponseDto response = userService.signUp(signUpRequest);

        assertEquals(400, response.getStatusCode());
        assertEquals("Invalid email format", response.getError());
    }

    @Test
    void testSignIn_ValidCredentials_Success() {
        when(validationUtils.isValidPassword(any(String.class))).thenReturn(true);
        when(userRepository.findByUsername(any(String.class))).thenReturn(Optional.of(new User()));
        Authentication authentication = new UsernamePasswordAuthenticationToken("testUser", "password");
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtUtils.generateToken(any())).thenReturn("dummyToken");
        when(subscribeService.saveSubscribe(anyString())).thenReturn("Subscribe Successfully");

        ResponseDto signInRequest = new ResponseDto();
        signInRequest.setUsername("testUser");
        signInRequest.setPassword("password");
        ResponseDto response = userService.signIn(signInRequest);

        assertEquals(200, response.getStatusCode());
        assertEquals("Successfully Signed In", response.getMessage());
        assertNotNull(response.getToken());
        assertEquals("dummyToken", response.getToken()); // Ensure token matches the mocked value
        assertNotNull(response.getUser());
        assertEquals("24Hr", response.getExpirationTime());
        }

    @Test
    void testSignIn_InvalidPassword_Failure() {
        when(validationUtils.isValidPassword(any(String.class))).thenReturn(false);

        ResponseDto signInRequest = new ResponseDto();
        signInRequest.setPassword("short");
        ResponseDto response = userService.signIn(signInRequest);

        assertEquals(400, response.getStatusCode());
        assertEquals("Password must be more than 6 characters", response.getError());
    }

    @Test
    void testUpdateUserSettings_ValidUser_Success() {
        User existingUser = new User();
        existingUser.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        UserDto userDto = new UserDto();
        userDto.setBudget("2000");
        userDto.setCurrency("EUR");
        userDto.setSubscribe(true);
        userDto.setNotification(false);
        ResponseDto response = userService.updateUserSettings(1L, userDto);

        assertEquals(200, response.getStatusCode());
        assertEquals("User Updated Successfully", response.getMessage());
        assertEquals("2000", existingUser.getBudget());
        assertEquals("EUR", existingUser.getCurrency());
    }

    @Test
    void testUpdateUserPassword_ValidPassword_Success() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setPassword("oldEncodedPassword");
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("oldPassword", "oldEncodedPassword")).thenReturn(true);
        when(passwordEncoder.encode(any(String.class))).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        ResponseDto response = userService.updateUserPassword(1L, "oldPassword", "newPassword");

        assertEquals(200, response.getStatusCode());
        assertEquals("Password Updated Successfully", response.getMessage());
        assertEquals("newEncodedPassword", existingUser.getPassword());
    }

    @Test
    void testUpdateProfileImage_ValidUser_Success() {
        User existingUser = new User();
        existingUser.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        UserDto userDto = new UserDto();
        userDto.setProfile_img("new_profile.jpg");
        ResponseDto response = userService.updateProfileImage(1L, userDto);

        assertEquals(200, response.getStatusCode());
        assertEquals("Profile Image Upload Successfully", response.getMessage());
        assertEquals("new_profile.jpg", existingUser.getProfile_img());
    }

    @Test
    public void testUpdateProfileImage_InternalServerError_ExceptionThrown() {
        when(userRepository.findById(anyLong())).thenThrow(new RuntimeException("Database connection failed"));

        UserDto userDto = new UserDto();
        ResponseDto response = userService.updateProfileImage(1L, userDto);
        assertEquals(500, response.getStatusCode());

        verify(userRepository, times(1)).findById(1L);
    }
}

