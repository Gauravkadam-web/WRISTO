import { Product } from './product';

export type ArticleCategory =
  | 'Horological Heritage'
  | 'Technical Calibers'
  | 'Collector Guide'
  | 'Design & Metallurgy';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface EditorialArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: ArticleCategory;
  author: Author;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  featuredProductIds: string[];
  contentSections: {
    heading?: string;
    paragraphs: string[];
    quote?: {
      text: string;
      attribution: string;
    };
    callout?: string;
  }[];
}

export interface ArticleWithProducts extends EditorialArticle {
  featuredProducts: Product[];
  prevArticle?: { slug: string; title: string };
  nextArticle?: { slug: string; title: string };
}
