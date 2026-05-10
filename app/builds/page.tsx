import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import BuildsClient from './BuildsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Builds',
    description: 'Explore Lalit Madan\'s builds, open-source work, and experiments across AI engineering, Python, and developer tools.',
    path: '/builds',
    keywords: ['AI Engineering Builds', 'Open Source Builds', 'Python OSS Work', 'LLM Developer Tools', 'Automation Projects'],
});

export default function BuildsPage() {
    return <BuildsClient />;
}
