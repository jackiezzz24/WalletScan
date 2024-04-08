package com.cs5500.walletscan;

import com.cs5500.walletscan.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UserTest {

    @Test
    public void testGetAuthorities_ReturnsSingleAuthority() {
        User user = new User();
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority("REGULAR")));
    }

    @Test
    public void testIsAccountNonExpired_ReturnsTrue() {
        User user = new User();
        assertTrue(user.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked_ReturnsTrue() {
        User user = new User();
        assertTrue(user.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired_ReturnsTrue() {
        User user = new User();
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled_ReturnsTrue() {
        User user = new User();
        assertTrue(user.isEnabled());
    }
}

