'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PostMeta } from '@/lib/types';

// Extend the Navigator interface to include WebMCP methods
declare global {
    interface Navigator {
        modelContext?: {
            registerTool: (tool: WebMCPTool) => void;
            unregisterTool: (name: string) => void;
        };
    }
}

interface WebMCPTool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, { type: string; description: string }>;
        required?: string[];
    };
    execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export default function WebMCPProvider() {
    const router = useRouter();

    useEffect(() => {
        // Only register if the browser has native WebMCP support
        // (Chrome behind chrome://flags/#web-mcp, expected stable H2 2026).
        // No polyfill — once a stable one is published it can be added here.
        if (!navigator.modelContext?.registerTool) return;

        // Tool 1: Get all posts
        navigator.modelContext.registerTool({
            name: 'get_all_posts',
            description: 'Returns a list of all blog posts with their title, slug, date, excerpt, tags, and category.',
            inputSchema: {
                type: 'object',
                properties: {},
            },
            execute: async (_input: Record<string, unknown>) => {
                const res = await fetch('/api/posts');
                const posts: PostMeta[] = await res.json();
                return posts;
            },
        });

        // Tool 2: Search posts
        navigator.modelContext.registerTool({
            name: 'search_posts',
            description: 'Search blog posts by a keyword. Matches against title, excerpt, tags, and category.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'Search keyword or phrase' },
                },
                required: ['query'],
            },
            execute: async (input: Record<string, unknown>) => {
                const query = String(input.query ?? '');
                const res = await fetch('/api/posts');
                const posts: PostMeta[] = await res.json();
                const q = query.toLowerCase();
                return posts.filter(
                    (p) =>
                        p.title.toLowerCase().includes(q) ||
                        p.excerpt.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.tags.some((t) => t.toLowerCase().includes(q))
                );
            },
        });

        // Tool 3: Get full post by slug
        navigator.modelContext.registerTool({
            name: 'get_post',
            description: 'Retrieve the full content of a blog post by its slug.',
            inputSchema: {
                type: 'object',
                properties: {
                    slug: { type: 'string', description: 'The URL slug of the post, e.g. "what-are-agents"' },
                },
                required: ['slug'],
            },
            execute: async (input: Record<string, unknown>) => {
                const slug = String(input.slug ?? '');
                const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
                if (!res.ok) return { error: `Post not found: ${slug}` };
                return res.json();
            },
        });

        // Tool 4: Navigate to a page
        navigator.modelContext.registerTool({
            name: 'navigate_to',
            description: 'Navigate the browser to a path on this site, e.g. "/about" or "/post/what-are-agents".',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string', description: 'Relative path to navigate to, e.g. "/about"' },
                },
                required: ['path'],
            },
            execute: async (input: Record<string, unknown>) => {
                const path = String(input.path ?? '/');
                router.push(path);
                return { navigated: true, path };
            },
        });

        console.log('[WebMCP] Registered 4 tools: get_all_posts, search_posts, get_post, navigate_to');

        return () => {
            ['get_all_posts', 'search_posts', 'get_post', 'navigate_to'].forEach((name) => {
                navigator.modelContext?.unregisterTool(name);
            });
        };
    }, [router]);

    // No polyfill script — tools activate only in browsers with native WebMCP support.
    // Once a stable polyfill is available, add it here (e.g. from /public/webmcp.js).
    return null;
}
