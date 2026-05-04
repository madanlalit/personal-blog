import { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { slugifyTag } from '@/lib/slug';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const latestPostDate = posts[0]?.date ? new Date(posts[0].date) : new Date();

    const blogEntries = posts.map((post) => ({
        url: `${SITE_CONFIG.url}/post/${post.slug}`,
        lastModified: new Date(post.modifiedDate || post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: SITE_CONFIG.url,
            lastModified: latestPostDate,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${SITE_CONFIG.url}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${SITE_CONFIG.url}/projects`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${SITE_CONFIG.url}/experience`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${SITE_CONFIG.url}/posts`,
            lastModified: latestPostDate,
            changeFrequency: 'daily',
            priority: 0.7,
        },
        ...blogEntries,
        ...getAllTags().map((tag) => ({
            url: `${SITE_CONFIG.url}/tags/${slugifyTag(tag)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        })),
    ];
}
