import fs from 'fs';
import path from 'path';
import { mockPosts } from '../src/data/mockData';

const SITE_URL = 'https://giant-sagan.vercel.app'; // Replace with actual URL
const SITE_TITLE = 'Giant Sagan Blog';
const SITE_DESCRIPTION = 'A minimal, retro-themed personal blog.';

const generateRSS = () => {
    const feedItems = mockPosts.map(post => `
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

    // Ensure public dir exists
    if (!fs.existsSync(path.resolve('public'))) {
        fs.mkdirSync(path.resolve('public'));
    }

    fs.writeFileSync(outputPath, rss);
    console.log(`✅ RSS Feed generated at ${outputPath}`);
};

generateRSS();
