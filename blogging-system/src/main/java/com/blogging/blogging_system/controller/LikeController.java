package com.blogging.blogging_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.blogging.blogging_system.service.LikeService;

@RestController
@RequestMapping("/api/posts")
public class LikeController{
        public final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

     @PostMapping("/{id}/like")
    public ResponseEntity<String> likePost(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        likeService.likePost(id, email);

        return ResponseEntity.ok("Post liked successfully");
    }

     @DeleteMapping("/{id}/like")
    public ResponseEntity<String> unlikePost(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        likeService.unlikePost(id, email);

        return ResponseEntity.ok("Post unliked successfully");
    }


     @GetMapping("/{id}/likes")
    public ResponseEntity<Long> getLikes(
            @PathVariable Long id) {

        long count = likeService.getLikeCount(id);

        return ResponseEntity.ok(count);
    }



}