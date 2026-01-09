import type { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = {
    title: 'Experience',
    description: 'Detailed professional journey of Lalit Madan, including roles at Cisco Systems and expertise in Python, AI, and test automation.',
};

export default function ExperiencePage() {
    return <ExperienceClient />;
}
