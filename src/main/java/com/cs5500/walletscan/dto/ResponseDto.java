package com.cs5500.walletscan.dto;

import com.cs5500.walletscan.entity.Transaction;
import com.cs5500.walletscan.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDto {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String expirationTime;
    private String username;
    private String email;
    private String password;
    private User user;
    private Transaction transaction;
}
