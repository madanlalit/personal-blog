import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Projects',
    description: 'Explore the personal projects and open-source contributions of Lalit Madan, ranging from AI agents to automation tools.',
    path: '/projects',
    keywords: ['AI agent projects', 'open source', 'automation tools', 'Lalit Madan projects'],
});

export default function ProjectsPage() {
    return <ProjectsClient />;
}
