package com.blogging.blogging_system.controller;

import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.repository.UserRepository;

import java.util.List;

import org.springframework.web.bind.annotation.*;


@RestController 
@RequestMapping ("/users")
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
}
