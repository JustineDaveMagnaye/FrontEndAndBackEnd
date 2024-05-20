package com.rocs.osd.service.user;


import com.rocs.osd.domain.user.User;
import com.rocs.osd.exception.domain.*;
import jakarta.mail.MessagingException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface UserService {
    User register(User user) throws UsernameNotFoundException, UsernameExistsException, EmailExistsException, MessagingException, PersonExistsException, UserNotFoundException;

    User forgotPassword(User user) throws UsernameNotFoundException, MessagingException;

    List<User> getUsers();

    User findUserByUsername(String username);

    User verifyOtpForgotPassword(User newUser) throws PersonExistsException, OtpExistsException;

    boolean verifyOtp(String username, String otp);

}
