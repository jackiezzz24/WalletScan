package com.cs5500.walletscan.repository;

import com.cs5500.walletscan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByEmailAndPassword(String email, String password);
    User findByEmail(String email);
}
