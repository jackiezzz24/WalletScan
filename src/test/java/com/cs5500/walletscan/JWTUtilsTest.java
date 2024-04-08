package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.JWTUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class JWTUtilsTest {

    private JWTUtils jwtUtils;
    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        userDetails = new User("username", "password", authorities);
        jwtUtils = new JWTUtils();
    }

    @Test
    public void testGenerateToken_ValidUser_ReturnsToken() {
        String token = jwtUtils.generateToken(userDetails);
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    public void testExtractUsername_ValidToken_ReturnsUsername() {
        String token = jwtUtils.generateToken(userDetails);
        String extractedUsername = jwtUtils.extractUsername(token);
        assertEquals("username", extractedUsername);
    }

    @Test
    public void testIsTokenValid_ValidTokenAndUser_ReturnsTrue() {
        String token = jwtUtils.generateToken(userDetails);
        assertTrue(jwtUtils.isTokenValid(token, userDetails));
    }

    @Test
    public void testIsTokenExpired_ValidToken_ReturnsFalse() {
        String token = jwtUtils.generateToken(userDetails);
        assertFalse(jwtUtils.isTokenExpired(token));
    }
}

