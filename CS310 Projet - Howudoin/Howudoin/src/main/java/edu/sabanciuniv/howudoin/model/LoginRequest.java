package edu.sabanciuniv.howudoin.model;

import lombok.Setter;
import lombok.Getter;
import lombok.Builder;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class LoginRequest {
    private String username;
    private String password;
    //Both fields to hold the user information provided during the login process.
}
