package com.example.blog.controller;

import com.example.blog.entity.Article;
import com.example.blog.entity.User;
import com.example.blog.payload.request.ArticleRequest;
import com.example.blog.payload.response.ArticleResponse;
import com.example.blog.payload.response.MessageResponse;
import com.example.blog.repository.ArticleRepository;
import com.example.blog.repository.UserRepository;
import com.example.blog.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    @Autowired
    ArticleRepository articleRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable paging = PageRequest.of(page, size);
        Page<Article> pageArticles = articleRepository.findByStatusOrderByCreatedAtDesc(1, paging);

        Map<String, Object> response = new HashMap<>();
        response.put("articles", pageArticles.getContent().stream().map(this::convertToResponse).toList());
        response.put("currentPage", pageArticles.getNumber());
        response.put("totalItems", pageArticles.getTotalElements());
        response.put("totalPages", pageArticles.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));
        
        // Increment view count
        article.setViewCount(article.getViewCount() + 1);
        articleRepository.save(article);

        return ResponseEntity.ok(convertToResponse(article));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createArticle(@RequestBody ArticleRequest articleRequest) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User author = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Article article = new Article();
        article.setTitle(articleRequest.getTitle());
        article.setContent(articleRequest.getContent());
        article.setSummary(articleRequest.getSummary());
        article.setStatus(articleRequest.getStatus());
        article.setAuthor(author);

        articleRepository.save(article);

        return ResponseEntity.ok(new MessageResponse("Article created successfully!"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @RequestBody ArticleRequest articleRequest) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!article.getAuthor().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You are not the author of this article!"));
        }

        article.setTitle(articleRequest.getTitle());
        article.setContent(articleRequest.getContent());
        article.setSummary(articleRequest.getSummary());
        article.setStatus(articleRequest.getStatus());

        articleRepository.save(article);

        return ResponseEntity.ok(new MessageResponse("Article updated successfully!"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!article.getAuthor().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You are not the author of this article!"));
        }

        articleRepository.delete(article);

        return ResponseEntity.ok(new MessageResponse("Article deleted successfully!"));
    }

    private ArticleResponse convertToResponse(Article article) {
        return new ArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getContent(),
                article.getSummary(),
                article.getStatus(),
                article.getViewCount(),
                article.getAuthor().getId(),
                article.getAuthor().getNickname() != null ? article.getAuthor().getNickname() : article.getAuthor().getUsername(),
                article.getCreatedAt(),
                article.getUpdatedAt()
        );
    }
}
