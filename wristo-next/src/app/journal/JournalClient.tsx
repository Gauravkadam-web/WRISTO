'use client';

import React, { useMemo, useState } from 'react';
import { EditorialArticle } from '@/types/editorial';
import JournalHeader from '@/components/journal/JournalHeader';
import LeadStoryCard from '@/components/journal/LeadStoryCard';
import CategoryFilter from '@/components/journal/CategoryFilter';
import ArticleGrid from '@/components/journal/ArticleGrid';

interface JournalClientProps {
  initialArticles: EditorialArticle[];
  categories: string[];
}

export default function JournalClient({
  initialArticles,
  categories
}: JournalClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Stories');

  const leadArticle = initialArticles[0];

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All Stories') {
      // Exclude lead article from the general grid when viewing all stories so it's not duplicated
      return initialArticles.slice(1);
    }
    return initialArticles.filter(
      (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [initialArticles, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      'All Stories': initialArticles.length
    };
    for (const a of initialArticles) {
      counts[a.category] = (counts[a.category] || 0) + 1;
    }
    return counts;
  }, [initialArticles]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (typeof window !== 'undefined') {
      const filterEl = document.querySelector('.journal-category-filter');
      if (filterEl && window.scrollY > 300) {
        filterEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="journal-page-wrapper">
      <div className="container">
        <JournalHeader />

        {/* Lead Story Hero */}
        {leadArticle && selectedCategory === 'All Stories' && (
          <div className="journal-lead-wrapper">
            <LeadStoryCard article={leadArticle} />
          </div>
        )}

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          counts={categoryCounts}
        />

        {/* Grid of Remaining Articles */}
        <section className="journal-grid-section">
          <div className="journal-section-heading-row">
            <h2 className="journal-section-title">
              {selectedCategory === 'All Stories' ? 'Recent Dispatches & Essays' : selectedCategory}
            </h2>
            <span className="journal-results-count">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'}
            </span>
          </div>

          <ArticleGrid articles={filteredArticles} />
        </section>
      </div>
    </div>
  );
}
