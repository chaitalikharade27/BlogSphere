package com.blogging.blogging_system.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blogging.blogging_system.dto.RegisterRequest;
import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.entity.Role;
import com.blogging.blogging_system.repository.UserRepository;
import com.blogging.blogging_system.dto.LoginRequest;
import com.blogging.blogging_system.security.JWTService;

@Service 
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    
        public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTService jwtService) {
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
            this.jwtService=jwtService;
        }

        public User register(RegisterRequest request){
            if(userRepository.findByEmail(request.getEmail()).isPresent()){
                throw new RuntimeException("Email already exists");
            }
             User user=new User();
                user.setName(request.getName());
                user.setEmail(request.getEmail());

                String hashedPassword=passwordEncoder.encode(request.getPassword());

                user.setPassword(hashedPassword);
                user.setRole(Role.USER);

                    return userRepository.save(user);
                
        }

        public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(user.getEmail());
    }
}
