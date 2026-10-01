import type { Metadata } from 'next';
import { getArticles, getCategories } from '@/services/editorialService';
import JournalClient from './JournalClient';

export const metadata: Metadata = {
  title: 'The Horological Journal | WRISTO',
  description: 'Curated essays, technical caliber breakdowns, metallurgy investigations, and collector’s guides written by master horologists.',
  openGraph: {
    title: 'The Horological Journal | WRISTO',
    description: 'Authoritative horological storytelling, technical caliber breakdowns, and collector guides.',
    type: 'website'
  }
};

export default async function JournalPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    Promise.resolve(getCategories())
  ]);

  return <JournalClient initialArticles={articles} categories={categories} />;
}
