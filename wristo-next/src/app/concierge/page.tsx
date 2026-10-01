import { Suspense } from 'react';
import type { Metadata } from 'next';
import ConciergeClient from './ConciergeClient';

export const metadata: Metadata = {
  title: 'AI Watch Concierge & Horological Advisor | WRISTO',
  description: 'Consult WRISTO’s neural horological advisor to discover the exact timepiece tailored to your anatomy, occasion, and mechanical preferences.',
  openGraph: {
    title: 'AI Watch Concierge & Horological Advisor | WRISTO',
    description: 'Bespoke watch discovery tailored to your wrist size, movement preferences, and lifestyle occasions.',
    type: 'website'
  }
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ConciergePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const stepNum = typeof params?.step === 'string' ? parseInt(params.step, 10) : 1;
  const initialStep = stepNum >= 1 && stepNum <= 5 ? stepNum : 1;
  const initialResults = params?.results === 'true';

  return (
    <Suspense fallback={null}>
      <ConciergeClient initialStep={initialStep} initialResults={initialResults} />
    </Suspense>
  );
}

