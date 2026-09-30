import { redirect } from 'next/navigation';

interface WatchesRedirectProps {
  params: Promise<{ id: string }>;
}

export default async function WatchesRedirectPage({ params }: WatchesRedirectProps) {
  const { id } = await params;
  redirect(`/product/${id}`);
}
