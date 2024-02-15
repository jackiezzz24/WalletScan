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

    @Column (nullable = false, unique = true, length = 45)
    private String email;

    @Column(nullable = false, length = 45)
    private String username;

    @Column(nullable = false, length = 640)
    private String password;
}
