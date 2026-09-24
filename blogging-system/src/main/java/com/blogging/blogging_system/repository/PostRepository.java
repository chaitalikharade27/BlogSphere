package com.blogging.blogging_system.repository;

import com.blogging.blogging_system.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTitleContainingIgnoreCase(String keyword);

    List<Post> findByContentContainingIgnoreCase(String keyword);

    List<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String titleKeyword,
            String contentKeyword);

    List<Post> findByCategoryId(Long categoryId);

    @Query("SELECT p FROM Post p LEFT JOIN p.category c WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Post> searchPosts(@Param("keyword") String keyword);

    List<Post> findByUserEmail(String email);

    @Query(value = "SELECT COUNT(*) FROM post_likes", nativeQuery = true)
    long countTotalLikes();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query(value = "DELETE FROM post_likes WHERE user_id = :userId", nativeQuery = true)
    void removeUserFromAllLikes(@Param("userId") Long userId);
}
