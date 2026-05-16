import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import AnalyticsClient from './AnalyticsClient';

export const metadata: Metadata = createPageMetadata({
    title: 'Analytics',
    description: 'Privacy-first page view analytics for lalitmadan.com. No third-party trackers, no cookies.',
    path: '/analytics',
});

export default function AnalyticsPage() {
    return <AnalyticsClient />;
}
