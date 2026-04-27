import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import AboutClient from './AboutClient';

export const metadata: Metadata = createPageMetadata({
    title: 'About',
    description: 'Learn more about Lalit Madan, a software engineer specializing in AI agents, context engineering, and reliable agentic workflows.',
    path: '/about',
    keywords: ['Lalit Madan', 'AI agents', 'context engineering', 'software engineer'],
});

export default function AboutPage() {
    return <AboutClient />;
}
