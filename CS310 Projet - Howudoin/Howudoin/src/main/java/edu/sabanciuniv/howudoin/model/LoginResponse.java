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
public class LoginResponse {
    private String token;  // Field to hold the JWT token.
    private String userName; // Field to hold the username associated with the response.
}