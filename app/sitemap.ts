import { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { slugifyTag } from '@/lib/slug';

function formatDate(date: Date): string {
    // Bing Webmaster Tools often rejects sitemaps if the lastmod date includes milliseconds.
    // This formats the date to strictly YYYY-MM-DDThh:mm:ssZ
    return date.toISOString().split('.')[0] + 'Z';
}

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const latestPostDate = posts[0]?.date ? new Date(posts[0].date) : new Date();

    const blogEntries = posts.map((post) => ({
        url: `${SITE_CONFIG.url}/post/${post.slug}`,
        lastModified: formatDate(new Date(post.modifiedDate || post.date)),
    }));

    return [
        {
            url: SITE_CONFIG.url,
            lastModified: formatDate(latestPostDate),
        },
        {
            url: `${SITE_CONFIG.url}/about`,
            lastModified: formatDate(new Date()),
        },
        {
            url: `${SITE_CONFIG.url}/projects`,
            lastModified: formatDate(new Date()),
        },
        {
            url: `${SITE_CONFIG.url}/experience`,
            lastModified: formatDate(new Date()),
        },
        {
            url: `${SITE_CONFIG.url}/posts`,
            lastModified: formatDate(latestPostDate),
        },
        ...blogEntries,
        ...getAllTags().map((tag) => ({
            url: `${SITE_CONFIG.url}/tags/${slugifyTag(tag)}`,
            lastModified: formatDate(new Date()),
        })),
    ];
}
