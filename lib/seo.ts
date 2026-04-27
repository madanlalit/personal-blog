import type { Metadata } from 'next';
import { SITE_CONFIG } from './config';

type PageMetadataInput = {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
};

export function absoluteUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${SITE_CONFIG.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function createPageMetadata({
    title,
    description,
    path,
    keywords,
}: PageMetadataInput): Metadata {
    const url = absoluteUrl(path);

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: 'website',
            siteName: SITE_CONFIG.title,
            locale: SITE_CONFIG.locale,
            images: [{ url: absoluteUrl(SITE_CONFIG.defaultImage) }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: SITE_CONFIG.twitterHandle,
            images: [absoluteUrl(SITE_CONFIG.defaultImage)],
        },
    };
}

