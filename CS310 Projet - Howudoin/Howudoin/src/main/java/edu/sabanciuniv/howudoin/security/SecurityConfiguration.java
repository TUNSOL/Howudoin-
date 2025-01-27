package edu.sabanciuniv.howudoin.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Configuration
@EnableMethodSecurity
@Component
public class SecurityConfiguration {
    @Autowired
    private JwtAuthEntryPoint authEntryPoint;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public DefaultSecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable() // Disable CSRF for stateless APIs
                .cors().and()     // Enable CORS
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless session
                .and()
                .authorizeRequests()
                .requestMatchers(HttpMethod.PUT, "/register").permitAll()  // Allow registration without authentication
                .requestMatchers(HttpMethod.POST, "/login").permitAll()    // Allow login without authentication
                .requestMatchers(HttpMethod.POST, "/friends/add").authenticated() // Require authentication for this endpoint
                .anyRequest().authenticated() // All other requests require authentication
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return httpSecurity.build();
    }
/*
    @Bean
    public DefaultSecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .anonymous().disable()
                .csrf().disable()
                .cors().disable()
                .anonymous()
                .and()
                .authorizeRequests()
                .requestMatchers(HttpMethod.PUT, "/register").permitAll()
                .requestMatchers(HttpMethod.POST,"/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/friends/add").authenticated()
                .anyRequest().authenticated();
        return httpSecurity.build();
    }*/
}
