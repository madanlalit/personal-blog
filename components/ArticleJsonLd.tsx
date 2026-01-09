import { SITE_CONFIG } from '@/lib/config';
import type { Post } from '@/lib/types';

interface ArticleJsonLdProps {
    post: Post;
}

export default function ArticleJsonLd({ post }: ArticleJsonLdProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${SITE_CONFIG.url}/post/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date, // Assuming no separate modified date for now
        author: {
            '@type': 'Person',
            '@id': `${SITE_CONFIG.url}/#person`, // Reference the global Person entity
            name: SITE_CONFIG.author,
            url: SITE_CONFIG.url,
        },
        publisher: {
            '@type': 'Person',
            '@id': `${SITE_CONFIG.url}/#person`,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_CONFIG.url}/post/${post.slug}`,
        },
        image: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`, // Default image if post has no specific image
        },
        keywords: post.tags?.join(', '),
        inLanguage: SITE_CONFIG.locale,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
