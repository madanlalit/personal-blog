import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn more about Lalit Madan, a software engineer specializing in AI agents, context engineering, and reliable agentic workflows.',
};

export default function AboutPage() {
    return <AboutClient />;
}
