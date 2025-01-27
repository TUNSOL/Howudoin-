package edu.sabanciuniv.howudoin.security;
import org.springframework.stereotype.Component;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static io.micrometer.common.util.StringUtils.isEmpty;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private Logger logger = LoggerFactory.getLogger(OncePerRequestFilter.class);

    @Autowired
    private JwtHelperUtils jwtHelperUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // JWT authentication filter logic,
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (isEmpty(header) || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = header.split(" ")[1].trim();
        if (!jwtHelperUtils.validateToken(token, userDetailsService.loadUserByUsername(jwtHelperUtils.getUsernameFromToken(token)))) {
            filterChain.doFilter(request, response);
            return;
        }


        UserDetails userDetails = userDetailsService.loadUserByUsername(jwtHelperUtils.getUsernameFromToken(token));
        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null,
                userDetails == null ?
                        List.of() : userDetails.getAuthorities()
        );
        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities()));
        System.out.println("Username: " + userDetails.getUsername());
        //jwtHelperUtils.getUsernameFromToken(userDetails.getUsername());
        filterChain.doFilter(request, response);

    }
        /*
        if(details.getPassword().equals(request.getHeader("password"))){
            logger.info("User is authenticated");
        } else {
            logger.error("User is not authenticated");
        }
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(details.getUsername(), details.getPassword(), details.getAuthorities()));
        System.out.println("Username: " + username);
        jwtHelperUtils.getUsernameFromToken(username);
        filterChain.doFilter(request, response);
    /*
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip JWT validation for login or other public endpoints
        String requestPath = request.getRequestURI();
        if (requestPath.equals("/login") || requestPath.equals("/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        // JWT authentication filter logic for other endpoints
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = header.substring(7); // Extract token
        String username = jwtHelperUtils.getUsernameFromToken(token);

        // Validate token and set security context
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!jwtHelperUtils.validateToken(token, userDetails)) {
            filterChain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }/*
    /*
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // JWT authentication filter logic,
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (isEmpty(header) || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }


        final String token = header.split(" ")[1].trim();
        if (!jwtHelperUtils.validateToken(token, userDetailsService.loadUserByUsername(jwtHelperUtils.getUsernameFromToken(token)))) {
            filterChain.doFilter(request, response);
            return;
        }


        UserDetails userDetails = userDetailsService.loadUserByUsername(jwtHelperUtils.getUsernameFromToken(token));
        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null,
                userDetails == null ?
                        List.of() : userDetails.getAuthorities()
        );
        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities()));
        System.out.println("Username: " + userDetails.getUsername());
        jwtHelperUtils.getUsernameFromToken(userDetails.getUsername());
        filterChain.doFilter(request, response);
        /*
        if(details.getPassword().equals(request.getHeader("password"))){
            logger.info("User is authenticated");
        } else {
            logger.error("User is not authenticated");
        }
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(details.getUsername(), details.getPassword(), details.getAuthorities()));
        System.out.println("Username: " + username);
        jwtHelperUtils.getUsernameFromToken(username);
        filterChain.doFilter(request, response);

    }*/
}
