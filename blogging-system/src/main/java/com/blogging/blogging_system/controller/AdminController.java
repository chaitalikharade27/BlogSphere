package com.blogging.blogging_system.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.blogging.blogging_system.service.PostService;
import com.blogging.blogging_system.service.CommentService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PostService postService;
    private final CommentService commentService;

    public AdminController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Welcome to Admin Dashboard";
    }

    @GetMapping("/users")
    public String manageUsers() {
        return "Admin can manage users";
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<String> deleteAnyPost(@PathVariable Long id) {
        try {
            postService.adminDeletePost(id);
            return ResponseEntity.ok("Admin deleted post with id: " + id);
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body("Error deleting image associated with post");
        }
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        commentService.adminDeleteComment(id);
        return ResponseEntity.ok("Admin deleted comment with id: " + id);
    }

    @GetMapping("/categories")
    public String manageCategories() {
        return "Admin can manage categories";
    }
}