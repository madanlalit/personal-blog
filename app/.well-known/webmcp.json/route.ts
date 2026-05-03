import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/config';

export async function GET() {
    const manifest = {
        name: SITE_CONFIG.author,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        tools: [
            {
                name: 'get_all_posts',
                description: 'Returns a list of all blog posts with their title, SEO title, slug, date, excerpt, keywords, tags, and category.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
            {
                name: 'search_posts',
                description: 'Search blog posts by a keyword. Matches against title, SEO title, excerpt, keywords, tags, and category.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search keyword or phrase',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'get_post',
                description: 'Retrieve the full content of a blog post by its slug.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        slug: {
                            type: 'string',
                            description: 'The URL slug of the post, e.g. "what-are-agents"',
                        },
                    },
                    required: ['slug'],
                },
            },
            {
                name: 'navigate_to',
                description: 'Navigate the browser to a path on this site, e.g. "/about" or "/post/what-are-agents".',
                inputSchema: {
                    type: 'object',
                    properties: {
                        path: {
                            type: 'string',
                            description: 'Relative path to navigate to, e.g. "/about"',
                        },
                    },
                    required: ['path'],
                },
            },
            {
                name: 'contact_me',
                description: 'Send Lalit a message or collaboration request via the contact form on the About page.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Your name',
                        },
                        email: {
                            type: 'string',
                            description: 'Your email address',
                        },
                        message: {
                            type: 'string',
                            description: 'Your message or inquiry',
                        },
                    },
                    required: ['name', 'email', 'message'],
                },
            },
        ],
    };

    return NextResponse.json(manifest, {
        headers: {
            'Cache-Control': 'public, s-maxage=86400',
            'Content-Type': 'application/json',
        },
    });
}
