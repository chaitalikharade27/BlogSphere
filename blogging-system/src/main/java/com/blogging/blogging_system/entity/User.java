package com.blogging.blogging_system.entity;
import java.util.ArrayList;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

import java.util.List;

@Entity
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Enumerated(EnumType.STRING)
    private Role role;
   

    private String name;
    @Column (unique=true,nullable = false)
    private String email;
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

     @OneToMany(mappedBy = "user")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Post> posts = new ArrayList<>();

    public User(){

    }

    public Long getId(){
        return id;
    }

    public Long setId(long id){
        return this.id=id;
    }

    public Role getRole() {
        return role;
    }

    public String getName() {
        return name;
    }
     
    public void setRole(Role role) {
        this.role = role;
    }


    public void setName(String name) {
        this.name = name;
    }

        public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
         this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
