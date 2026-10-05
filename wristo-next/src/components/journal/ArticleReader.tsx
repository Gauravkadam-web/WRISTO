'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleWithProducts } from '@/types/editorial';
import { Lightbulb } from 'lucide-react';
import FeaturedTimepiecesCarousel from './FeaturedTimepiecesCarousel';
import ArticleNavigation from './ArticleNavigation';

interface ArticleReaderProps {
  article: ArticleWithProducts;
}

export default function ArticleReader({ article }: ArticleReaderProps) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <article className="journal-reader-wrapper">
      {/* Sticky Reading Progress Bar */}
      <div className="journal-reading-progress-track">
        <div
          className="journal-reading-progress-bar"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container journal-reader-container">
        {/* Breadcrumbs */}
        <nav className="journal-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="crumb-sep">/</span>
          <Link href="/journal">Journal</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{article.category}</span>
        </nav>

        {/* Article Header */}
        <header className="journal-reader-header">
          <div className="journal-reader-category">
            <span>{article.category}</span>
            <span className="journal-meta-dot">&bull;</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="journal-reader-title">{article.title}</h1>
          <p className="journal-reader-subtitle">{article.subtitle}</p>

          <div className="journal-reader-author-bar">
            <div className="journal-author-initials">
              {article.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="journal-reader-author-info">
              <span className="journal-reader-author-name">{article.author.name}</span>
              <span className="journal-reader-author-role">
                {article.author.role} &bull; Published {article.publishedAt}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="journal-reader-hero-img-box">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 992px) 100vw, 860px"
            style={{ objectFit: 'contain', padding: '40px' }}
          />
        </div>

        {/* Article Body Content */}
        <div className="journal-reader-content">
          {article.contentSections.map((sec, secIdx) => (
            <section key={secIdx} className="journal-content-section">
              {sec.heading && (
                <h2 className="journal-section-heading">{sec.heading}</h2>
              )}

              {sec.paragraphs.map((p, pIdx) => {
                // Apply traditional drop-cap to the very first paragraph of the first section
                const isFirstParagraph = secIdx === 0 && pIdx === 0;
                return (
                  <p
                    key={pIdx}
                    className={`journal-paragraph ${isFirstParagraph ? 'has-drop-cap' : ''}`}
                  >
                    {p}
                  </p>
                );
              })}

              {sec.quote && (
                <blockquote className="journal-pull-quote">
                  <p className="journal-quote-text">&ldquo;{sec.quote.text}&rdquo;</p>
                  <cite className="journal-quote-cite">&mdash; {sec.quote.attribution}</cite>
                </blockquote>
              )}

              {sec.callout && (
                <aside className="journal-callout-box">
                  <div className="journal-callout-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lightbulb size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
                  </div>
                  <p className="journal-callout-text">{sec.callout}</p>
                </aside>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="journal-tags-strip">
          <span className="journal-tags-label">Keywords:</span>
          {article.tags.map((tag) => (
            <span key={tag} className="journal-keyword-tag">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Card */}
        <div className="journal-author-bio-card">
          <div className="journal-author-bio-initials">
            {article.author.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="journal-author-bio-details">
            <h4 className="journal-author-bio-name">{article.author.name}</h4>
            <span className="journal-author-bio-role">{article.author.role}</span>
            <p className="journal-author-bio-text">{article.author.bio}</p>
          </div>
        </div>

        {/* Featured Timepieces in this Story */}
        {article.featuredProducts && article.featuredProducts.length > 0 && (
          <FeaturedTimepiecesCarousel products={article.featuredProducts} />
        )}

        {/* Previous / Next Story Navigation */}
        <ArticleNavigation prev={article.prevArticle} next={article.nextArticle} />
      </div>
    </article>
  );
}
