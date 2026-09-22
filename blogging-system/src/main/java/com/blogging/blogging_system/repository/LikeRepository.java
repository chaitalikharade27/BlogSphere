package com.blogging.blogging_system.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.blogging.blogging_system.entity.Like;
import com.blogging.blogging_system.entity.Post;
import com.blogging.blogging_system.entity.User;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);

    long countByPost(Post post);

    void deleteByUserAndPost(User user, Post post);
}