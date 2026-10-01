'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialArticle } from '@/types/editorial';

interface ArticleGridProps {
  articles: EditorialArticle[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="journal-empty-state">
        <p>No horological stories found in this category.</p>
      </div>
    );
  }

  return (
    <div className="journal-articles-grid">
      {articles.map((article) => (
        <article key={article.id} className="journal-story-card">
          <Link href={`/journal/${article.slug}`} className="journal-story-img-link">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
              style={{ objectFit: 'contain', padding: '24px' }}
            />
            <span className="journal-story-cat-badge">{article.category}</span>
          </Link>

          <div className="journal-story-body">
            <div className="journal-story-meta">
              <span>{article.readTime}</span>
              <span className="journal-meta-dot">&bull;</span>
              <span>{article.publishedAt}</span>
            </div>

            <h3 className="journal-story-title">
              <Link href={`/journal/${article.slug}`}>{article.title}</Link>
            </h3>

            <p className="journal-story-excerpt">{article.excerpt}</p>

            <div className="journal-story-footer">
              <span className="journal-story-author-name">By {article.author.name}</span>
              <Link href={`/journal/${article.slug}`} className="journal-story-read-link">
                Read Story &rarr;
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
