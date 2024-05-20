package com.rocs.osd.controller.user;


import com.rocs.osd.domain.user.User;
import com.rocs.osd.domain.user.principal.UserPrincipal;
import com.rocs.osd.exception.domain.*;
import com.rocs.osd.service.user.UserService;
import com.rocs.osd.utils.security.jwt.provider.token.JWTTokenProvider;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.rocs.osd.utils.security.constant.SecurityConstant.JWT_TOKEN_HEADER;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class UserController {
    private final UserService userService;


    private AuthenticationManager authenticationManager;
    private JWTTokenProvider jwtTokenProvider;

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager, JWTTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user)
            throws UsernameNotFoundException, UsernameExistsException, EmailExistsException, MessagingException, PersonExistsException, UserNotFoundException {
        User newUser = this.userService.register(user);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<User> forgotPassword(@RequestBody User user)
            throws UsernameNotFoundException, UsernameExistsException, EmailExistsException, MessagingException, PersonExistsException, UserNotFoundException {
            User newUser = this.userService.forgotPassword(user);
            return new ResponseEntity<>(newUser, HttpStatus.OK);
    }
    @PostMapping("/verify-forgot-password")
    public ResponseEntity<User> verifyForgotPassword(@RequestBody User user)
            throws UsernameNotFoundException, PersonExistsException, OtpExistsException {
        User newUser = this.userService.verifyOtpForgotPassword(user);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");

        if (username == null || otp == null) {
            return new ResponseEntity<>("Both username and otp are required", HttpStatus.BAD_REQUEST);
        }
        boolean isVerified = userService.verifyOtp(username, otp);
        if (isVerified) {
            return new ResponseEntity<>("Account unlocked successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid OTP", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        authenticate(user.getUsername(), user.getPassword());
        User loginUser = userService.findUserByUsername(user.getUsername());
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeaders = getJwtHeader(userPrincipal);
        return new ResponseEntity<>("Login success...", jwtHeaders, HttpStatus.OK);
    }
    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    private void authenticate(String username, String password) {
        this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
    private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(userPrincipal));
        return headers;
    }
}
