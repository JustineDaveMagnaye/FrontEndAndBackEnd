package com.rocs.osd.utils.security.jwt.filter.authorization;


import com.rocs.osd.utils.security.jwt.provider.token.JWTTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static com.rocs.osd.utils.security.constant.SecurityConstant.OPTIONS_HTTP_METHOD;
import static com.rocs.osd.utils.security.constant.SecurityConstant.TOKEN_PREFIX;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

/**
 * This authorizes or rejects any request once.
 * */
@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private JWTTokenProvider jwtTokenProvider;

    public JwtAuthorizationFilter(JWTTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // if the http method in the request is OPTIONS, then let it pass thru
        // OPTIONS collect information about the server that request is trying to access
        if(request.getMethod().equals(OPTIONS_HTTP_METHOD)) {
            response.setStatus(HttpStatus.OK.value());
        } else {
            // if other http methods, check if the authorization header from the request contains the token prefix
            // if not, stop the filtering process
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            if(authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_PREFIX)) {
                filterChain.doFilter(request, response);
                return;
            }
            // if token prefix is present from the authorization header,
            // 1. obtain the token
            // 2. get the username
            // 3. check if the token with username is valid
            // 4. get the authorization from the user, its authorities and the request
            // 5. set the authentication to the security context holder
            String token = authorizationHeader.substring(TOKEN_PREFIX.length());
            String username = jwtTokenProvider.getSubject(token);
            if(jwtTokenProvider.isTokenValid(username, token) && SecurityContextHolder.getContext().getAuthentication()==null) {
                List<GrantedAuthority> authorities = jwtTokenProvider.getAuthorities(token);
                Authentication authentication = jwtTokenProvider.getAuthentication(username, authorities, request);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
