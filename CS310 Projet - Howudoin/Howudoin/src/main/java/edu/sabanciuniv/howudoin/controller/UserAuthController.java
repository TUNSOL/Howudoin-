package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.LoginRequest;
import edu.sabanciuniv.howudoin.model.LoginResponse;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.repository.UserRepository;
import edu.sabanciuniv.howudoin.security.CustomUserDetailsService;
import edu.sabanciuniv.howudoin.security.JwtHelperUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserAuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtHelperUtils jwtHelper;
    @Autowired
    private CustomUserDetailsService userService;
    @Autowired
    private UserRepository userRepository;

    // Handles the login request by authenticating the user and generating a JWT token.
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        this.doAuthenticate(loginRequest.getUsername(), loginRequest.getPassword());
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = this.jwtHelper.generateToken(userDetails);
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .userName(userDetails.getUsername()).build();
        return ResponseEntity.ok(response);
    }

    private void doAuthenticate(String username, String password) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
            authenticationManager.authenticate(authentication);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid Username or Password!");
        }
    }
}

