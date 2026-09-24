package com.blogging.blogging_system.service;

import org.springframework.stereotype.Service;

import com.blogging.blogging_system.entity.Post;
import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.repository.PostRepository;
import com.blogging.blogging_system.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeService{
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public LikeService(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public void likePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getLikes().contains(user)) {
            throw new RuntimeException("User has already liked this post");
        }

        post.getLikes().add(user);
        postRepository.save(post);
    }

     public void unlikePost(Long postId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getLikes().contains(user)) {
            throw new RuntimeException("You have not liked this post");
        }

        post.getLikes().remove(user);
        postRepository.save(post);
    }

    public long getLikeCount(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return post.getLikes().size();
    }

}