import { createHash } from 'crypto';
import { SITE_CONFIG } from './config';

export const discoveryHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export const BLOG_CONTENT_SKILL = `---
name: blog-content
description: Use this skill when an agent needs to discover, search, cite, or summarize Lalit Madan's public blog posts about AI agents, context engineering, SKILL.md, AGENTS.md, and developer workflows.
---

# Blog Content

Use Lalit Madan's public blog APIs when you need source material from lalitmadan.com.

## Workflow

1. Fetch the post index from https://lalitmadan.com/api/posts.
2. Search titles, excerpts, tags, keywords, and categories for the user's topic.
3. Fetch the full post with https://lalitmadan.com/api/posts/{slug}.
4. Cite canonical post URLs in final answers.

## Useful Endpoints

- https://lalitmadan.com/api/posts returns post metadata.
- https://lalitmadan.com/api/posts/{slug} returns a full post.
- https://lalitmadan.com/markdown returns a Markdown overview.
- https://lalitmadan.com/markdown/post/{slug} returns a post as Markdown.
- https://lalitmadan.com/llms.txt lists important pages and topics.

## Topics

- AI agents
- Context engineering
- SKILL.md and agent skills
- AGENTS.md
- Agentic tools
- Developer workflows

## Rules

- Prefer the Markdown endpoints when the answer needs quoted or cited source text.
- Prefer the JSON endpoints when filtering or selecting posts.
- Do not assume private or authenticated data exists; these APIs expose public blog content only.
`;

export function sha256Digest(value: string): string {
    return `sha256:${createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

export const blogToolDefinitions = [
    {
        name: 'get_all_posts',
        title: 'Get all posts',
        description: 'Returns public blog posts with title, SEO title, slug, date, excerpt, keywords, tags, and category.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'search_posts',
        title: 'Search posts',
        description: 'Searches public blog posts by title, SEO title, excerpt, keywords, tags, and category.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Keyword or phrase to search for',
                },
            },
            required: ['query'],
        },
    },
    {
        name: 'get_post',
        title: 'Get post',
        description: 'Retrieves the full public blog post content for a slug.',
        inputSchema: {
            type: 'object',
            properties: {
                slug: {
                    type: 'string',
                    description: 'Post slug, for example "context-engineering-for-ai-agents"',
                },
            },
            required: ['slug'],
        },
    },
];

export const mcpServerCard = {
    $schema: 'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json',
    version: '1.0',
    protocolVersion: '2025-06-18',
    serverInfo: {
        name: 'lalitmadan-blog',
        title: 'Lalit Madan Blog MCP',
        version: '1.0.0',
    },
    description: 'Public MCP endpoint for discovering and reading Lalit Madan blog posts about AI agents, context engineering, and developer workflows.',
    documentationUrl: `${SITE_CONFIG.url}/llms.txt`,
    transport: {
        type: 'streamable-http',
        endpoint: '/mcp',
    },
    capabilities: {
        tools: {
            listChanged: false,
        },
    },
    authentication: {
        required: false,
        schemes: [],
    },
    instructions: 'Use the tools to search and retrieve public blog content. No authentication is required.',
    resources: [],
    tools: blogToolDefinitions,
    prompts: [],
};
