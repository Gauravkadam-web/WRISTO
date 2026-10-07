import { EditorialArticle, ArticleWithProducts } from '@/types/editorial';
import { Product } from '@/types/product';
import { apiClient } from './apiClient';

export async function getArticles(category?: string): Promise<EditorialArticle[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All Stories') {
      params.set('category', category);
    }
    const endpoint = `/journal/articles${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await apiClient.get<any>(endpoint).catch(() => null);
    if (res && res.data) {
      if (Array.isArray(res.data.content)) return res.data.content;
      if (Array.isArray(res.data)) return res.data;
    }
  } catch {
    return [];
  }
  return [];
}

export async function getFeaturedLeadArticle(): Promise<EditorialArticle | null> {
  const articles = await getArticles();
  return articles[0] || null;
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithProducts | null> {
  try {
    const res = await apiClient.get<any>(`/journal/articles/${encodeURIComponent(slug)}`).catch(() => null);
    if (res && res.data && res.data.slug) {
      const article: EditorialArticle = res.data;
      let featuredProducts: Product[] = [];
      if (article.featuredProductIds && article.featuredProductIds.length > 0) {
        try {
          const prodRes = await apiClient.get<any>('/watches?limit=100').catch(() => null);
          const allProds: Product[] = prodRes?.data?.products || [];
          featuredProducts = allProds.filter(p => article.featuredProductIds.includes(p.id));
        } catch {
          // Ignore
        }
      }

      return {
        ...article,
        featuredProducts,
        prevArticle: res.data.prevArticle,
        nextArticle: res.data.nextArticle
      };
    }
  } catch {
    return null;
  }
  return null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map(a => a.slug);
}

export function getCategories(): string[] {
  return [
    'All Stories',
    'Horological Heritage',
    'Technical Calibers',
    'Collector Guide',
    'Design & Metallurgy'
  ];
}

export const editorialService = {
  getArticles,
  getFeaturedLeadArticle,
  getArticleBySlug,
  getAllArticleSlugs,
  getCategories
};
