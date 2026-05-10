import { getAllPostsMeta } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { markdownResponse } from '@/lib/markdownResponse';

export async function GET() {
    const latestPosts = getAllPostsMeta().slice(0, 3);
    const postsMarkdown = latestPosts
        .map((post) => [
            `### [${post.seoTitle || post.title}](${SITE_CONFIG.url}/post/${post.slug})`,
            post.seoTitle ? `Display title: ${post.title}` : '',
            post.subtitle ? `_${post.subtitle}_` : '',
            `Published: ${post.date}`,
            post.modifiedDate ? `Updated: ${post.modifiedDate}` : '',
            `Category: ${post.category}`,
            `Read time: ${post.readTime} min`,
            '',
            post.excerpt,
            '',
            post.keywords?.length ? `Keywords: ${post.keywords.join(', ')}` : '',
            post.tags.length ? `Tags: ${post.tags.join(', ')}` : '',
        ].filter(Boolean).join('\n'))
        .join('\n\n');

    return markdownResponse(`# Lalit Madan

AI engineer writing about context engineering, Python, open source, and reliable AI agents.

This site is a public notebook of experiments, implementation notes, and lessons from working with LLMs, agents, automation, and developer workflows.

## Core Pages

- [About](${SITE_CONFIG.url}/about)
- [Builds](${SITE_CONFIG.url}/builds)
- [Posts](${SITE_CONFIG.url}/posts)
- [RSS](${SITE_CONFIG.url}/rss.xml)
- [LLMs guide](${SITE_CONFIG.url}/llms.txt)

## Latest Posts

${postsMarkdown}
`);
}

export async function HEAD() {
    return markdownResponse('');
}
