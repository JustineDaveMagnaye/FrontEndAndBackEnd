package com.rocs.osd.repository.user;

import com.rocs.osd.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByUsername(String username);
    boolean existsByUserId(String userId);

    boolean existsUserByUsername(String username);
}
