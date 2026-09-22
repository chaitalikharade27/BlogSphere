package com.blogging.blogging_system.controller;

import com.blogging.blogging_system.entity.Comment;
import com.blogging.blogging_system.service.CommentService;
import com.blogging.blogging_system.dto.CommentRequest;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {
     private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

     // CREATE COMMENT
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<Comment> createComment(
            @PathVariable("id") Long postId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Comment comment = commentService.createComment(
                postId,
                request,
                userDetails);

        return ResponseEntity.ok(comment);
    }

     // GET COMMENTS
    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(
            @PathVariable("id") Long postId) {

        List<Comment> comments =
                commentService.getCommentsByPost(postId);

        return ResponseEntity.ok(comments);
    }

    // DELETE COMMENT
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<String> deleteComment(
            @PathVariable("id") Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        commentService.deleteComment(
                commentId,
                userDetails);

        return ResponseEntity.ok(
                "Comment deleted successfully");
    }

  
}
