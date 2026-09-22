package com.blogging.blogging_system.service;

import org.springframework.stereotype.Service;

import com.blogging.blogging_system.entity.Like;
import com.blogging.blogging_system.entity.Post;
import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.repository.LikeRepository;
import com.blogging.blogging_system.repository.PostRepository;
import com.blogging.blogging_system.repository.UserRepository;

@Service
public class LikeService{
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public LikeService(LikeRepository likeRepository, UserRepository userRepository, PostRepository postRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public void likePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.findByUserAndPost(user, post).isPresent()) {
            throw new RuntimeException("User has already liked this post");
        }

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);

        likeRepository.save(like);
    }

     public void unlikePost(Long postId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Like like = likeRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new RuntimeException("You have not liked this post"));

        likeRepository.delete(like);
    }

        public long getLikeCount(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return likeRepository.countByPost(post);
    }



}