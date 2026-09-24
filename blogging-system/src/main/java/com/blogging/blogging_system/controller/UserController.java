package com.blogging.blogging_system.controller;

import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.repository.UserRepository;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;

@RestController 
@RequestMapping ("/api/users")
public class UserController {
    private final UserRepository userRepository;
    
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public User createUser(@RequestBody User user){
            return userRepository.save(user);
    } 

    @GetMapping 
    public List<User> getUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
