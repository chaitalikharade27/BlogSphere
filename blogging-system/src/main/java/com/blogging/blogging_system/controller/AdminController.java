package com.blogging.blogging_system.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.blogging.blogging_system.service.PostService;
import com.blogging.blogging_system.service.CommentService;
import com.blogging.blogging_system.repository.*;
import com.blogging.blogging_system.entity.*;
import com.blogging.blogging_system.dto.DashboardStats;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PostService postService;
    private final CommentService commentService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CategoryRepository categoryRepository;

    public AdminController(PostService postService, CommentService commentService,
                           UserRepository userRepository, PostRepository postRepository,
                           CommentRepository commentRepository, CategoryRepository categoryRepository) {
        this.postService = postService;
        this.commentService = commentService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> dashboard() {
        long users = userRepository.count();
        long posts = postRepository.count();
        long comments = commentRepository.count();
        
        long likes = 0;
        try {
            likes = postRepository.countTotalLikes();
        } catch (Exception e) {
            // fallback if post_likes is empty or error
            likes = 0;
        }

        return ResponseEntity.ok(new DashboardStats(users, posts, comments, likes));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> manageUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestParam("role") String roleName) {
        return userRepository.findById(id).map(user -> {
            user.setRole(Role.valueOf(roleName.toUpperCase()));
            userRepository.save(user);
            return ResponseEntity.ok("User role updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Remove user from all likes
            postRepository.removeUserFromAllLikes(user.getId());
            
            // Delete all comments
            List<Comment> comments = commentRepository.findByUserId(user.getId());
            commentRepository.deleteAll(comments);
            
            // Delete all posts
            List<Post> posts = postRepository.findByUserEmail(user.getEmail());
            for (Post p : posts) {
                try {
                    postService.adminDeletePost(p.getId());
                } catch (Exception e) {}
            }
            
            // Finally delete the user
            userRepository.delete(user);
            return ResponseEntity.ok("User deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
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

    @GetMapping("/comments")
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentRepository.findAll());
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        commentService.adminDeleteComment(id);
        return ResponseEntity.ok("Admin deleted comment with id: " + id);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id).map(category -> {
            List<Post> posts = postRepository.findByCategoryId(id);
            for (Post post : posts) {
                post.setCategory(null);
                postRepository.save(post);
            }
            categoryRepository.delete(category);
            return ResponseEntity.ok("Category deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category categoryRequest) {
        Category category = new Category();
        category.setName(categoryRequest.getName().trim());
        return ResponseEntity.ok(categoryRepository.save(category));
    }
}