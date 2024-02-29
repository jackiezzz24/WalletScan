package com.cs5500.walletscan.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String budget;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private Boolean subscribe;

    @Column(nullable = false)
    private Boolean notification;

    @Column(nullable = false)
    private String profile_img;

    public User(String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.budget = "0";
        this.currency = "USD";
        this.subscribe = true;
        this.notification = true;
        this.profile_img = "";
    }
}
