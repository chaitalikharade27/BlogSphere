package com.blogging.blogging_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.blogging.blogging_system.entity.Comment;
import com.blogging.blogging_system.entity.Post;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
    List<Comment> findByUserId(Long userId);
}
