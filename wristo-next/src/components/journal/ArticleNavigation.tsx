'use client';

import React from 'react';
import Link from 'next/link';

interface NavItem {
  slug: string;
  title: string;
}

interface ArticleNavigationProps {
  prev?: NavItem;
  next?: NavItem;
}

export default function ArticleNavigation({ prev, next }: ArticleNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="journal-article-nav-strip" aria-label="Story Navigation">
      {prev ? (
        <Link href={`/journal/${prev.slug}`} className="journal-nav-card prev-card">
          <span className="journal-nav-label">&larr; Previous Story</span>
          <span className="journal-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <div className="journal-nav-card empty" />
      )}

      {next ? (
        <Link href={`/journal/${next.slug}`} className="journal-nav-card next-card">
          <span className="journal-nav-label">Next Story &rarr;</span>
          <span className="journal-nav-title">{next.title}</span>
        </Link>
      ) : (
        <div className="journal-nav-card empty" />
      )}
    </nav>
  );
}
