package com.blogging.blogging_system.controller;

import com.blogging.blogging_system.entity.Post;
import com.blogging.blogging_system.service.PostService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // CREATE
    @PostMapping(consumes = {"multipart/form-data"})
    public Post createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "categoryName", required = false) String categoryName,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) throws java.io.IOException {
        return postService.createPost(title, content, categoryName, image);
    }

    // READ ALL
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {

        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public Post updatePost(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "categoryName", required = false) String categoryName,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) throws java.io.IOException {

        return postService.updatePost(id, title, content, categoryName, image);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body("Error deleting image associated with post");
        }
    }



    @GetMapping("/search")
    public List<Post> searchPosts(@RequestParam String keyword) {
        return postService.searchPosts(keyword);
    }

    @GetMapping("/category/{categoryId}")
     public List<Post> getPostsByCategory(
     @PathVariable Long categoryId) {

    return postService.getPostsByCategory(categoryId);
    }

    @GetMapping("/my-posts")
    public List<Post> getMyPosts() {
        return postService.getMyPosts();
    }
}
