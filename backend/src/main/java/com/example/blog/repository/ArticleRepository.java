package com.example.blog.repository;

import com.example.blog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findByStatusOrderByCreatedAtDesc(Integer status, Pageable pageable);
    List<Article> findByAuthorId(Long userId);
    Page<Article> findByAuthorId(Long userId, Pageable pageable);
}
