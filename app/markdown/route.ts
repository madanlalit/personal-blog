import { getAllPostsMeta } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/config';
import { markdownResponse } from '@/lib/markdownResponse';

export async function GET() {
    const latestPosts = getAllPostsMeta().slice(0, 3);
    const postsMarkdown = latestPosts
        .map((post) => [
            `### [${post.title}](${SITE_CONFIG.url}/post/${post.slug})`,
            post.subtitle ? `_${post.subtitle}_` : '',
            `Published: ${post.date}`,
            `Category: ${post.category}`,
            `Read time: ${post.readTime} min`,
            '',
            post.excerpt,
            '',
            post.tags.length ? `Tags: ${post.tags.join(', ')}` : '',
        ].filter(Boolean).join('\n'))
        .join('\n\n');

    return markdownResponse(`# Lalit Madan

AI engineer writing about context engineering, Python, open source, and reliable AI agents.

This site is a public notebook of experiments, implementation notes, and lessons from working with LLMs, agents, automation, and developer workflows.

## Core Pages

- [About](${SITE_CONFIG.url}/about)
- [Projects](${SITE_CONFIG.url}/projects)
- [Archive](${SITE_CONFIG.url}/archive)
- [RSS](${SITE_CONFIG.url}/rss.xml)
- [LLMs guide](${SITE_CONFIG.url}/llms.txt)

## Latest Posts

${postsMarkdown}
`);
}

export async function HEAD() {
    return markdownResponse('');
}
