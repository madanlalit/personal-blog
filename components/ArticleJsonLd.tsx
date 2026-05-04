import { SITE_CONFIG } from '@/lib/config';
import type { Post } from '@/lib/types';

interface ArticleJsonLdProps {
    post: Post;
}

export default function ArticleJsonLd({ post }: ArticleJsonLdProps) {
    const articleUrl = `${SITE_CONFIG.url}/post/${post.slug}`;
    const imageUrl = post.image
        ? `${SITE_CONFIG.url}${post.image.startsWith('/') ? post.image : `/${post.image}`}`
        : `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                '@id': `${articleUrl}#article`,
                headline: post.seoTitle || post.title,
                alternativeHeadline: post.seoTitle ? post.title : undefined,
                description: post.excerpt,
                datePublished: post.date,
                dateModified: post.modifiedDate || post.date,
                author: {
                    '@type': 'Person',
                    '@id': `${SITE_CONFIG.url}/#person`,
                    name: SITE_CONFIG.author,
                    url: SITE_CONFIG.url,
                },
                publisher: {
                    '@type': 'Person',
                    '@id': `${SITE_CONFIG.url}/#person`,
                },
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': articleUrl,
                },
                image: {
                    '@type': 'ImageObject',
                    url: imageUrl,
                },
                articleSection: post.category,
                keywords: [...(post.keywords || []), ...(post.tags || [])].join(', '),
                wordCount: post.content.split(/\s+/).filter(Boolean).length,
                timeRequired: `PT${post.readTime}M`,
                inLanguage: SITE_CONFIG.language,
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${articleUrl}#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: SITE_CONFIG.url,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Posts',
                        item: `${SITE_CONFIG.url}/posts`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: post.title,
                        item: articleUrl,
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
