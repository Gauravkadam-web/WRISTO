'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EditorialArticle } from '@/types/editorial';

interface LeadStoryProps {
  article: EditorialArticle;
}

export default function LeadStoryCard({ article }: LeadStoryProps) {
  return (
    <article className="journal-lead-card">
      <Link href={`/journal/${article.slug}`} className="journal-lead-image-wrap">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 992px) 100vw, 55vw"
          style={{ objectFit: 'contain', padding: '32px' }}
        />
        <div className="journal-lead-image-overlay" />
        <span className="journal-lead-badge">FEATURED ESSAY</span>
      </Link>

      <div className="journal-lead-content">
        <div className="journal-lead-meta-top">
          <span className="journal-category-tag">{article.category}</span>
          <span className="journal-meta-dot">&bull;</span>
          <span className="journal-read-time">{article.readTime}</span>
        </div>

        <h2 className="journal-lead-title">
          <Link href={`/journal/${article.slug}`}>{article.title}</Link>
        </h2>

        <p className="journal-lead-subtitle">{article.subtitle}</p>
        <p className="journal-lead-excerpt">{article.excerpt}</p>

        <div className="journal-lead-footer">
          <div className="journal-author-box">
            <div className="journal-author-initials">
              {article.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="journal-author-text">
              <span className="journal-author-name">{article.author.name}</span>
              <span className="journal-author-role">{article.author.role}</span>
            </div>
          </div>

          <Link href={`/journal/${article.slug}`} className="btn btn-primary journal-lead-btn">
            Read Full Essay &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
