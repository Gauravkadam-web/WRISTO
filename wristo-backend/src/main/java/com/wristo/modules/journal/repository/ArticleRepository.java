package com.wristo.modules.journal.repository;

import com.wristo.modules.journal.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {

    Optional<Article> findBySlug(String slug);

    Optional<Article> findBySlugAndIsPublishedTrue(String slug);

    Optional<Article> findByIdAndIsPublishedTrue(String id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, String id);

    Optional<Article> findFirstByIsLeadStoryTrueAndIsPublishedTrueOrderByPublishedAtDesc();

    Page<Article> findByIsPublishedTrueOrderByPublishedAtDesc(Pageable pageable);

    Page<Article> findByCategoryIgnoreCaseAndIsPublishedTrueOrderByPublishedAtDesc(String category, Pageable pageable);

    List<Article> findByIsPublishedTrueOrderByPublishedAtDesc();

    @Query("SELECT a.category AS category, COUNT(a) AS count FROM Article a WHERE a.isPublished = true GROUP BY a.category")
    List<Object[]> countPublishedArticlesByCategoryGroup();

    Optional<Article> findFirstByIsPublishedTrueAndPublishedAtLessThanOrderByPublishedAtDesc(Instant publishedAt);

    Optional<Article> findFirstByIsPublishedTrueAndPublishedAtGreaterThanOrderByPublishedAtAsc(Instant publishedAt);

    @Modifying
    @Query("UPDATE Article a SET a.isLeadStory = false WHERE a.isLeadStory = true")
    void clearAllLeadStories();

    @Modifying
    @Query("UPDATE Article a SET a.isLeadStory = true WHERE a.id = :id")
    void setLeadStoryById(@Param("id") String id);

    @Modifying
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCount(@Param("id") String id);
}
