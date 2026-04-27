import type { Metadata } from 'next';
import { getAllPostsMeta } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { createPageMetadata } from '@/lib/seo';
import HomeClient from './HomeClient';

export const metadata: Metadata = createPageMetadata({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    path: '/',
    keywords: SITE_CONFIG.keywords.split(', '),
});

export default async function HomePage() {
    // Server-side: Fetch posts at build time
    const latestPosts = getAllPostsMeta().slice(0, 3);

    return <HomeClient initialPosts={latestPosts} />;
}
