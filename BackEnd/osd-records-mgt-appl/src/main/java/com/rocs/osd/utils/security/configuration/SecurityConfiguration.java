package com.rocs.osd.utils.security.configuration;

import com.rocs.osd.utils.security.constant.SecurityConstant;
import com.rocs.osd.utils.security.jwt.filter.authentication.access.denied.JwtAccessDeniedHandler;
import com.rocs.osd.utils.security.jwt.filter.authentication.forbidden.AuthenticationEntryPoint;
import com.rocs.osd.utils.security.jwt.filter.authorization.JwtAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    private JwtAuthorizationFilter jwtAuthorizationFilter;
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private AuthenticationEntryPoint authenticationEntryPoint;
    private UserDetailsService userDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationConfiguration authConfiguration;

    @Autowired
    public SecurityConfiguration(JwtAuthorizationFilter jwtAuthorizationFilter,
                                 JwtAccessDeniedHandler jwtAccessDeniedHandler,
                                 AuthenticationEntryPoint authenticationEntryPoint,
                                 @Qualifier("userDetailsService") UserDetailsService userDetailsService,
                                 BCryptPasswordEncoder bCryptPasswordEncoder,
                                 AuthenticationConfiguration authConfiguration) {
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authConfiguration = authConfiguration;
    }

    @Autowired
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authConfiguration.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Access-Control-Allow-Headers", "Authorization, x-xsrf-token, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, " +
                "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Jwt-Token, Uid"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).cors(cors -> corsConfigurationSource())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers(SecurityConstant.PUBLIC_URLS).permitAll().anyRequest().authenticated())
                .exceptionHandling((e) -> {
                    e.authenticationEntryPoint(authenticationEntryPoint);
                    e.accessDeniedHandler(jwtAccessDeniedHandler);})
                .addFilterBefore(jwtAuthorizationFilter, BasicAuthenticationFilter.class);
        return http.build();
    }

}
