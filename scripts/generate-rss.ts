import fs from 'fs';
import path from 'path';
import { SITE_CONFIG } from '../src/config';

const SITE_URL = SITE_CONFIG.url;
const SITE_TITLE = SITE_CONFIG.title;
const SITE_DESCRIPTION = SITE_CONFIG.description;

interface PostMeta {
    id: string;
    title: string;
    excerpt: string;
    date: string;
}

const generateRSS = () => {
    // Read posts from generated JSON
    const indexPath = path.resolve('public', 'posts', 'index.json');

    if (!fs.existsSync(indexPath)) {
        console.log('⚠️ No posts/index.json found. Run generate-posts first.');
        return;
    }

    const posts: PostMeta[] = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    const feedItems = posts.map(post => `
    <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/post/${post.id}</link>
        <guid>${SITE_URL}/post/${post.id}</guid>
        <description><![CDATA[${post.excerpt}]]></description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
    `).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    ${feedItems}
</channel>
</rss>`;

    const outputPath = path.resolve('public', 'rss.xml');
    fs.writeFileSync(outputPath, rss);
    console.log(`✅ RSS Feed generated at ${outputPath}`);
};

generateRSS();
