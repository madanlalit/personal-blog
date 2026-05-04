import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { getAllPostsMeta } from '@/lib/posts';
import ClientShell from '@/components/ClientShell';
import JsonLd from '@/components/JsonLd';
import WebMCPProvider from '@/components/WebMCPProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import './app.css';

const GOOGLE_ANALYTICS_ID = 'G-25B25C48S4';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
        default: SITE_CONFIG.title,
        template: `%s | ${SITE_CONFIG.author}`,
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords.split(', '),
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    alternates: {
        canonical: SITE_CONFIG.url,
        types: {
            'application/rss+xml': `${SITE_CONFIG.url}/rss.xml`,
        },
    },
    openGraph: {
        type: 'website',
        locale: SITE_CONFIG.locale,
        url: SITE_CONFIG.url,
        siteName: SITE_CONFIG.title,
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        images: [{ url: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}` }],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.title,
        description: SITE_CONFIG.description,
        creator: SITE_CONFIG.twitterHandle,
        images: [`${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`],
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: SITE_CONFIG.favicon,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch posts at build time for the Commander
    const posts = getAllPostsMeta();

    return (
        <html lang={SITE_CONFIG.language}>
            <body>
                <JsonLd />
                <WebMCPProvider />
                <ClientShell posts={posts}>
                    {children}
                </ClientShell>
                <Analytics />
                <SpeedInsights />
                <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
            </body>
        </html>
    );
}
