package com.rocs.osd.utils.security.enumeration;


import static com.rocs.osd.utils.security.constant.Authority.*;

public enum Role {
    ROLE_STUDENT(STUDENT_AUTHORITIES),

    ROLE_EMPLOYEE(EMPLOYEE_AUTHORITIES),

    ROLE_GUEST(GUEST_AUTHORITIES),
    ROLE_ADMIN(ADMIN_AUTHORITIES),
    ROLE_SUPER_ADMIN(SUPER_ADMIN_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
