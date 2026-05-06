import { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { slugifyTag } from '@/lib/slug';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();

    const blogEntries = posts.map((post) => ({
        url: `${SITE_CONFIG.url}/post/${post.slug}`,
    }));

    return [
        {
            url: SITE_CONFIG.url,
        },
        {
            url: `${SITE_CONFIG.url}/about`,
        },
        {
            url: `${SITE_CONFIG.url}/projects`,
        },
        {
            url: `${SITE_CONFIG.url}/experience`,
        },
        {
            url: `${SITE_CONFIG.url}/posts`,
        },
        ...blogEntries,
        ...getAllTags().map((tag) => ({
            url: `${SITE_CONFIG.url}/tags/${slugifyTag(tag)}`,
        })),
    ];
}
