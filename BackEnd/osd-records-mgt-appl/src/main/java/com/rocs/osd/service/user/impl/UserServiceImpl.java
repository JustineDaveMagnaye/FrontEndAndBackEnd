package com.rocs.osd.service.user.impl;


import com.rocs.osd.domain.employee.Employee;
import com.rocs.osd.domain.external.External;
import com.rocs.osd.domain.student.Student;
import com.rocs.osd.domain.user.User;
import com.rocs.osd.domain.user.principal.UserPrincipal;
import com.rocs.osd.exception.domain.OtpExistsException;
import com.rocs.osd.exception.domain.PersonExistsException;
import com.rocs.osd.exception.domain.UserNotFoundException;
import com.rocs.osd.exception.domain.UsernameExistsException;
import com.rocs.osd.repository.employee.EmployeeRepository;
import com.rocs.osd.repository.external.ExternalRepository;
import com.rocs.osd.repository.student.StudentRepository;
import com.rocs.osd.repository.user.UserRepository;
import com.rocs.osd.service.email.EmailService;
import com.rocs.osd.service.login.attempt.LoginAttemptService;
import com.rocs.osd.service.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.rocs.osd.utils.security.enumeration.Role.*;


@Service
@Transactional
@Qualifier("userDetailsService")
public class UserServiceImpl implements UserService, UserDetailsService {

    private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    private UserRepository userRepository;
    private StudentRepository studentRepository;
    private EmployeeRepository employeeRepository;
    private ExternalRepository externalRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private LoginAttemptService loginAttemptService;

    private EmailService emailService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           StudentRepository studentRepository,
                           EmployeeRepository employeeRepository,
                           ExternalRepository externalRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           LoginAttemptService loginAttemptService,
                           EmailService emailService) {
        this.employeeRepository = employeeRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.externalRepository = externalRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findUserByUsername(username);
        if (user == null) {
            LOGGER.error("Username not found...");
            throw new UsernameNotFoundException("Username not found.");
        }
        validateLoginAttempt(user);
        user.setLastLoginDate(new Date());
        this.userRepository.save(user);
        UserPrincipal userPrincipal = new UserPrincipal(user);
        LOGGER.info("User information found...");
        return userPrincipal;
    }
    private void validateLoginAttempt(User user) {
        if(!user.isLocked()) {
            if(loginAttemptService.hasExceededMaxAttempts(user.getUsername())) {
                user.setLocked(true);
            } else {
                user.setLocked(false);
            }
        } else {
            loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
        }
    }
    @Override
    public User register(User newUser) throws UsernameNotFoundException, UsernameExistsException, MessagingException, PersonExistsException, UserNotFoundException {
        validateNewUsername(newUser.getUsername());
        validatePassword(newUser.getPassword());
        String otp = generateOTP();
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        user.setJoinDate(new Date());
        user.setActive(true);
        if(newUser.getStudent() != null && newUser.getStudent().getStudentNumber() != null) {
            String studentNumber = newUser.getStudent().getStudentNumber();
            String email = newUser.getStudent().getEmail();
            boolean isStudentExists = studentRepository.existsByStudentNumberAndEmail(studentNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getStudent().getStudentNumber());
            if (!isStudentExists) {
                throw new PersonExistsException("Student Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Student Already Exists!");
            }
            emailService.sendNewPasswordEmail(email,otp);
            user.setUserId(newUser.getStudent().getStudentNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_STUDENT.name());
            user.setAuthorities(Arrays.stream(ROLE_STUDENT.getAuthorities()).toList());
        } else if(newUser.getEmployee() != null && newUser.getEmployee().getEmployeeNumber() != null) {
            String employeeNumber = newUser.getEmployee().getEmployeeNumber();
            String email = newUser.getEmployee().getEmail();
            boolean isEmployeeExists = employeeRepository.existsByEmployeeNumberAndEmail(employeeNumber,email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getEmployee().getEmployeeNumber());
            if (!isEmployeeExists) {
                throw new PersonExistsException("Employee Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Employee Already Exists!");
            }
            emailService.sendNewPasswordEmail(email,otp);
            user.setUserId(newUser.getEmployee().getEmployeeNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_EMPLOYEE.name());
            user.setAuthorities(Arrays.stream(ROLE_EMPLOYEE.getAuthorities()).toList());
        } else if (newUser.getExternal() != null && newUser.getExternal().getExternalNumber() != null) {
            String externalNumber = newUser.getExternal().getExternalNumber();
            String email = newUser.getExternal().getEmail();
            boolean isExternalExists = externalRepository.existsByExternalNumberAndEmail(externalNumber, email);
            boolean isUserIdExists = userRepository.existsByUserId(newUser.getExternal().getExternalNumber());
            if (!isExternalExists) {
                throw new PersonExistsException("Employee Number Does Not Exist!!");
            } else if (isUserIdExists) {
                throw new PersonExistsException("Employee Already Exists!");
            }
            emailService.sendNewPasswordEmail(email,otp);
            user.setUserId(newUser.getExternal().getExternalNumber());
            user.setOtp(otp);
            user.setLocked(true);
            user.setRole(ROLE_EMPLOYEE.name());
            user.setAuthorities(Arrays.stream(ROLE_EMPLOYEE.getAuthorities()).toList());
        } else  {
            LOGGER.info("Guest account created!");
                user.setUserId(newUser.getGuest().getGuestNumber());
                user.setLocked(false);
                user.setRole(ROLE_GUEST.name());
                user.setAuthorities(Arrays.stream(ROLE_GUEST.getAuthorities()).toList());
        }
        userRepository.save(user);
        LOGGER.info("User registered successfully!");
        return user;
    }

    @Override
    public User forgotPassword(User newUser) throws UsernameNotFoundException, MessagingException {
        String username = newUser.getUsername();
        boolean isUsernameExist = userRepository.existsUserByUsername(username);
        if(isUsernameExist){
            User user = userRepository.findUserByUsername(username);
            String otp = generateOTP();
            user.setOtp(otp);
            String userNumber = user.getUserId();
            Student studentNumber = studentRepository.findByStudentNumber(userNumber);
            Employee employeeNumber = employeeRepository.findByEmployeeNumber(userNumber);
            External externalNumber = externalRepository.findByExternalNumber(userNumber);
            if(studentNumber != null){
                emailService.sendNewPasswordEmail(studentNumber.getEmail(),otp);
            } else if(employeeNumber != null){
                emailService.sendNewPasswordEmail(employeeNumber.getEmail(),otp);
            } else if(externalNumber != null){
                emailService.sendNewPasswordEmail(externalNumber.getEmail(),otp);
            }
            userRepository.save(user);
            LOGGER.info("Username Found!");
        } else {
            throw new UsernameNotFoundException("Username Not Found!");
        }
        return newUser;
    }
    @Override
    public User verifyOtpForgotPassword(User newUser) throws UsernameNotFoundException, PersonExistsException, OtpExistsException {
        validatePassword(newUser.getPassword());
        String username = newUser.getUsername();
        String newPassword = passwordEncoder.encode(newUser.getPassword());
        String otp = newUser.getOtp();
        User user = userRepository.findUserByUsername(username);
        if(user.getOtp().equals(otp)){
            user.setPassword(newPassword);
            user.setOtp(null);
        } else {
            throw new OtpExistsException("Incorrect OTP code!");
        }
        return newUser;
    }
    @Override
    public boolean verifyOtp(String username, String otp) {
        User user = userRepository.findUserByUsername(username);
        if (user != null && user.getOtp().equals(otp)) {
            user.setLocked(false);
            user.setOtp(null);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<User> getUsers() {
        return this.userRepository.findAll();
    }

    private void validateNewUsername(String newUsername)
            throws UserNotFoundException, UsernameExistsException, PersonExistsException {
        User userByNewUsername = findUserByUsername(newUsername);
        if (StringUtils.isNotBlank(StringUtils.EMPTY)) {
            User currentUser = findUserByUsername(StringUtils.EMPTY);
            if (currentUser == null) {
                throw new UserNotFoundException("User not found.");
            }
            if (userByNewUsername != null && !userByNewUsername.getId().equals(currentUser.getId())) {
                throw new PersonExistsException("Username already exists.");
            }
        } else {
            if (userByNewUsername != null) {
                throw new PersonExistsException("Username already exists.");
            }
        }
    }
    private void validatePassword(String password) throws PersonExistsException {
        String passwordPattern = ".*[^a-zA-Z0-9].*";
        if (!password.matches(passwordPattern)) {
            throw new PersonExistsException("Please create a stronger password. Password should contain special characters.");
        }
    }
    private String generateOTP() {
        return RandomStringUtils.randomAlphanumeric(10);
    }
    private String generateUserId() {
        return RandomStringUtils.randomNumeric(10);
    }

    @Override
    public User findUserByUsername(String username) {
        return this.userRepository.findUserByUsername(username);
    }


}

