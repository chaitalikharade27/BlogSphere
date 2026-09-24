package com.blogging.blogging_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.blogging.blogging_system.entity.Post;
import com.blogging.blogging_system.entity.User;
import com.blogging.blogging_system.entity.Category;
import com.blogging.blogging_system.repository.PostRepository;
import com.blogging.blogging_system.repository.UserRepository;
import com.blogging.blogging_system.repository.CategoryRepository;

import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ImageStorageService imageStorageService;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ImageStorageService imageStorageService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.imageStorageService = imageStorageService;
    }

    public Post createPost(
            String title,
            String content,
            String categoryName,
            MultipartFile image) throws IOException {

        Post post = new Post();

        post.setTitle(title);
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(getCurrentUser());

        if (categoryName != null && !categoryName.trim().isEmpty()) {
            Category category = categoryRepository.findFirstByNameIgnoreCase(categoryName.trim());
            if (category == null) {
                category = new Category();
                category.setName(categoryName.trim());
                category = categoryRepository.save(category);
            }
            post.setCategory(category);
        }

        if (image != null && !image.isEmpty()) {

            String imageUrl = imageStorageService.storeImage(image);

            post.setImageUrl(imageUrl);
        }

        return postRepository.save(post);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(getCurrentUser());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

   public Post updatePost(
        Long id,
        String title,
        String content,
        String categoryName,
        MultipartFile image
) throws IOException {

    Post post = postRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Post not found")
            );

    if (post.getUser() == null || !post.getUser().getEmail().equals(getCurrentUser().getEmail())) {
        throw new AccessDeniedException("You are not authorized to edit this post!");
    }

    post.setTitle(title);
    post.setContent(content);

    if (categoryName != null && !categoryName.trim().isEmpty()) {
        Category category = categoryRepository.findFirstByNameIgnoreCase(categoryName.trim());
        if (category == null) {
            category = new Category();
            category.setName(categoryName.trim());
            category = categoryRepository.save(category);
        }
        post.setCategory(category);
    }

    if (image != null && !image.isEmpty()) {

        if (post.getImageUrl() != null) {
            imageStorageService.deleteImage(
                    post.getImageUrl()
            );
        }

        String newImageUrl =
                imageStorageService.storeImage(image);

        post.setImageUrl(newImageUrl);
    }

    return postRepository.save(post);
}

  public void deletePost(Long id) throws IOException {

    Post post = postRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Post not found")
            );

    if (post.getUser() == null || !post.getUser().getEmail().equals(getCurrentUser().getEmail())) {
        throw new AccessDeniedException("You are not authorized to delete this post!");
    }

    if (post.getImageUrl() != null) {
        imageStorageService.deleteImage(
                post.getImageUrl()
        );
    }

    postRepository.delete(post);
}

    public void adminDeletePost(Long id) throws IOException{
        Post post = postRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Post not found")
            );

    if (post.getImageUrl() != null) {
        imageStorageService.deleteImage(
                post.getImageUrl()
        );
    }

    postRepository.delete(post);
    }

    public Post likePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = getCurrentUser();

        if (post.getLikes().contains(user)) {
            post.getLikes().remove(user); // unlike
        } else {
            post.getLikes().add(user); // like
        }
        return postRepository.save(post);
    }

    public List<Post> searchPosts(String keyword) {

        return postRepository
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                        keyword,
                        keyword);
    }

    public List<Post> getPostsByCategory(Long categoryId) {

        return postRepository.findByCategoryId(categoryId);
    }

    public List<Post> getMyPosts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return postRepository.findByUserEmail(email);
    }
}
