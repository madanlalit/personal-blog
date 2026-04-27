import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Projects',
    description: 'Explore Lalit Madan\'s AI engineering, Python, and open-source projects, including experiments with agents, automation, and developer tools.',
    path: '/projects',
    keywords: ['AI Agent Projects', 'Python OSS Projects', 'LLM Developer Tools', 'Open Source AI Tools', 'Automation Projects'],
});

export default function ProjectsPage() {
    return <ProjectsClient />;
}
