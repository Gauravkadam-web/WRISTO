import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  tag: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  slug: string;
}

const FEATURED_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    tag: 'Guide',
    title: 'How to Choose the Right Watch for Your Wrist',
    date: 'Sep 10, 2026',
    readTime: '5 min read',
    excerpt: 'Case diameter, lug-to-lug proportion, and wrist circumference—find the harmonic balance for your daily wear.',
    image: '/assets/blog/blog-wrist-guide.png',
    slug: 'resurgence-of-the-dress-watch',
  },
  {
    id: 'post-2',
    tag: 'Guides',
    title: 'Understanding Watch Movements',
    date: 'Sep 08, 2026',
    readTime: '6 min read',
    excerpt: 'From oscillating tungsten rotors to jewel escapements—the living mechanics behind kinetic self-winding calibers.',
    image: '/assets/blog/blog-movements.png',
    slug: 'architecture-of-automatic-calibers',
  },
  {
    id: 'post-3',
    tag: 'Brands',
    title: 'Top 5 Watch Brands in India',
    date: 'Sep 05, 2026',
    readTime: '7 min read',
    excerpt: 'Exploring the legacy, technical complications, and timeless aesthetic prestige of celebrated horological houses.',
    image: '/assets/blog/blog-top-brands.png',
    slug: 'collectors-guide-to-chronographs',
  },
];

export default function BlogPreviewSection() {
  return (
    <section className="section blog-preview-section" aria-label="From Our Blog">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <div className="section-label">JOURNAL &amp; STORIES</div>
            <h2 className="section-title">From Our Blog</h2>
            <p className="section-subtitle">
              Insights, guides and tips to help you choose the perfect watch.
            </p>
          </div>
          <Link href="/journal" className="view-all-link">
            View All &rarr;
          </Link>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="blog-preview-grid">
          {FEATURED_POSTS.map((post) => (
            <article key={post.id} className="blog-preview-card">
              <Link href={`/journal/${post.slug}`} className="blog-card-media-wrap">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={420}
                  height={260}
                  className="blog-card-img"
                  style={{ objectFit: 'contain' }}
                />
                <span className="blog-card-tag">{post.tag}</span>
              </Link>

              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                  <span className="blog-card-meta-dot">&bull;</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="blog-card-title">
                  <Link href={`/journal/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="blog-card-excerpt">
                  {post.excerpt}
                </p>

                <Link href={`/journal/${post.slug}`} className="blog-card-read-link">
                  Read Story &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
