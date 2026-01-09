import type { Metadata } from 'next';
import { getAllPostsMeta } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { getGithubData } from '@/lib/github';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: SITE_CONFIG.title.split(' | ')[0],
    description: SITE_CONFIG.description,
};

export default async function HomePage() {
    // Server-side: Fetch posts at build time
    const latestPosts = getAllPostsMeta().slice(0, 3);
    const githubData = await getGithubData();

    return <HomeClient initialPosts={latestPosts} githubData={githubData} />;
}

