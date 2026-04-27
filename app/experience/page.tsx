import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Experience',
    description: 'Detailed professional journey of Lalit Madan, including roles at Cisco Systems and expertise in Python, AI, and test automation.',
    path: '/experience',
    keywords: ['Lalit Madan experience', 'Software Engineer', 'Python', 'AI engineer'],
});

export default function ExperiencePage() {
    return <ExperienceClient />;
}
