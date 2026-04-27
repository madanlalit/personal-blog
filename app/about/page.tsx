import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import AboutClient from './AboutClient';

export const metadata: Metadata = createPageMetadata({
    title: 'About Lalit Madan',
    description: 'Learn more about Lalit Madan, an AI engineer focused on context engineering, Python, open source, and reliable agentic workflows.',
    path: '/about',
    keywords: ['Lalit Madan', 'AI Engineer India', 'Context Engineering Practitioner', 'Python Developer', 'Open Source Contributor'],
});

export default function AboutPage() {
    return <AboutClient />;
}
