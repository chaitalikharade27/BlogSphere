package com.blogging.blogging_system.service;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import com.blogging.blogging_system.entity.Comment;
import com.blogging.blogging_system.entity.Post;
import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.repository.CommentRepository;
import com.blogging.blogging_system.repository.PostRepository;
import com.blogging.blogging_system.repository.UserRepository;
import com.blogging.blogging_system.dto.CommentRequest;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class CommentService {
        private final CommentRepository commentRepository;
        private final PostRepository postRepository;
        private final UserRepository userRepository;

        public CommentService(CommentRepository commentRepository, PostRepository postRepository,
                        UserRepository userRepository) {
                this.commentRepository = commentRepository;
                this.postRepository = postRepository;
                this.userRepository = userRepository;
        }

        // CREATE COMMENT
        public Comment createComment(
                        Long postId,
                        CommentRequest request,
                        UserDetails userDetails) {

                // Find post
                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                // Find logged-in user
                User user = userRepository.findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Create comment
                Comment comment = new Comment();

                comment.setContent(request.getContent());
                comment.setUser(user);
                comment.setPost(post);
                comment.setCreatedAt(LocalDateTime.now());

                return commentRepository.save(comment);
        }

        // GET COMMENTS FOR A POST
        public List<Comment> getCommentsByPost(Long postId) {

                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                return commentRepository.findByPostOrderByCreatedAtDesc(post);
        }

        // DELETE COMMENT
        public void deleteComment(
                        Long commentId,
                        UserDetails userDetails) {

                Comment comment = commentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("Comment not found"));

                User loggedInUser = userRepository
                                .findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // ADMIN can delete any comment
                boolean isAdmin = loggedInUser.getRole().equals("ADMIN");

                // USER can delete only their own comment
                boolean isOwner = comment.getUser().getId()
                                .equals(loggedInUser.getId());

                if (!isAdmin && !isOwner) {
                        throw new RuntimeException(
                                        "You are not allowed to delete this comment");
                }

                commentRepository.delete(comment);
        }

        public void adminDeleteComment(Long commentId) {
                if (!commentRepository.existsById(commentId)) {
                        throw new RuntimeException("Comment not found");
                }
                commentRepository.deleteById(commentId);
        }
}
