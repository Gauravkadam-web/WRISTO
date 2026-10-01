import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllArticleSlugs, getArticleBySlug } from '@/services/editorialService';
import ArticleReader from '@/components/journal/ArticleReader';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | WRISTO Journal'
    };
  }

  return {
    title: `${article.title} | WRISTO Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage,
          alt: article.title
        }
      ]
    }
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleReader article={article} />;
}
