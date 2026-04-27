import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Experience',
    description: 'Professional experience for Lalit Madan, an AI engineer working with Python, context engineering, agentic workflows, and reliable software systems.',
    path: '/experience',
    keywords: ['AI Engineer Experience', 'Software Engineer', 'Python Engineering', 'Agentic Workflows', 'LLM Systems'],
});

export default function ExperiencePage() {
    return <ExperienceClient />;
}
