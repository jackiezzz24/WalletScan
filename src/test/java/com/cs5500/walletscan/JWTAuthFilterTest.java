package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.JWTUtils;
import com.cs5500.walletscan.config.JWTAuthFilter;
import com.cs5500.walletscan.service.impl.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.mockito.Mockito.*;

public class JWTAuthFilterTest {

    @Mock
    private JWTUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @InjectMocks
    private JWTAuthFilter jwtAuthFilter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testDoFilterInternal_ValidToken_Authenticated() throws ServletException, IOException {
        String validToken = "valid_token";
        String username = "testUser";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(jwtUtils.extractUsername(validToken)).thenReturn(username);

        UserDetails userDetails = User.withUsername(username).password("password").roles("USER").build();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        when(jwtUtils.isTokenValid(validToken, userDetails)).thenReturn(true);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);

        // Verify that authentication is set in SecurityContextHolder
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder
                .getContext().getAuthentication();
        UserDetails authenticatedUserDetails = (UserDetails) authentication.getPrincipal();
        assert(authenticatedUserDetails.getUsername()).equals(username);
    }

    // Write more test cases to cover other scenarios such as invalid token, missing token, etc.
}
