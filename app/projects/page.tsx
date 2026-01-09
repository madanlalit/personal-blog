import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Explore the personal projects and open-source contributions of Lalit Madan, ranging from AI agents to automation tools.',
};

export default function ProjectsPage() {
    return <ProjectsClient />;
}
