import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Work',
    description: 'Explore Lalit Madan\'s projects, open-source work, and experiments across AI engineering, Python, and developer tools.',
    path: '/projects',
    keywords: ['AI Engineering Work', 'Open Source Projects', 'Python OSS Work', 'LLM Developer Tools', 'Automation Projects'],
});

export default function ProjectsPage() {
    return <ProjectsClient />;
}
