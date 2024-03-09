package com.cs5500.walletscan.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String username;
    private String password;
    private String budget;
    private String currency;
    private Boolean subscribe;
    private Boolean notification;
    private String profile_img;
}
