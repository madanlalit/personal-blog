import { NextResponse } from 'next/server';
import { blogToolDefinitions } from '@/lib/agentDiscovery';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import type { Post } from '@/lib/types';

const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
};

type JsonRpcRequest = {
    jsonrpc?: string;
    id?: string | number | null;
    method?: string;
    params?: {
        name?: string;
        arguments?: Record<string, unknown>;
    };
};

function jsonRpcResult(id: JsonRpcRequest['id'], result: unknown) {
    return NextResponse.json(
        {
            jsonrpc: '2.0',
            id: id ?? null,
            result,
        },
        { headers: responseHeaders }
    );
}

function jsonRpcError(id: JsonRpcRequest['id'], code: number, message: string) {
    return NextResponse.json(
        {
            jsonrpc: '2.0',
            id: id ?? null,
            error: {
                code,
                message,
            },
        },
        { headers: responseHeaders, status: code === -32601 ? 404 : 400 }
    );
}

function searchPosts(query: string) {
    const normalizedQuery = query.toLowerCase();

    return getAllPosts()
        .filter((post) => {
            const searchableText = [
                post.title,
                post.seoTitle,
                post.excerpt,
                post.category,
                ...(post.tags || []),
                ...(post.keywords || []),
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        })
        .map(toPostMeta);
}

function toPostMeta(post: Post) {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        seoTitle: post.seoTitle,
        subtitle: post.subtitle,
        excerpt: post.excerpt,
        date: post.date,
        modifiedDate: post.modifiedDate,
        category: post.category,
        readTime: post.readTime,
        tags: post.tags,
        keywords: post.keywords,
        image: post.image,
    };
}

export async function GET() {
    return NextResponse.json(
        {
            name: 'lalitmadan-blog',
            description: 'Public MCP endpoint for discovering and reading Lalit Madan blog posts.',
            serverCard: '/.well-known/mcp/server-card.json',
        },
        { headers: responseHeaders }
    );
}

export async function POST(request: Request) {
    let body: JsonRpcRequest;

    try {
        body = await request.json();
    } catch {
        return jsonRpcError(null, -32700, 'Parse error');
    }

    switch (body.method) {
        case 'initialize':
            return jsonRpcResult(body.id, {
                protocolVersion: '2025-06-18',
                capabilities: {
                    tools: {
                        listChanged: false,
                    },
                },
                serverInfo: {
                    name: 'lalitmadan-blog',
                    title: 'Lalit Madan Blog MCP',
                    version: '1.0.0',
                },
                instructions: 'Use this MCP endpoint to search and retrieve public blog posts. No authentication is required.',
            });

        case 'tools/list':
            return jsonRpcResult(body.id, {
                tools: blogToolDefinitions,
            });

        case 'tools/call': {
            const toolName = body.params?.name;
            const args = body.params?.arguments || {};

            if (toolName === 'get_all_posts') {
                const posts = getAllPosts().map(toPostMeta);

                return jsonRpcResult(body.id, {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(posts, null, 2),
                        },
                    ],
                });
            }

            if (toolName === 'search_posts') {
                const query = String(args.query ?? '').trim();

                if (!query) {
                    return jsonRpcError(body.id, -32602, 'search_posts requires a non-empty query argument');
                }

                return jsonRpcResult(body.id, {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(searchPosts(query), null, 2),
                        },
                    ],
                });
            }

            if (toolName === 'get_post') {
                const slug = String(args.slug ?? '').trim();

                if (!slug) {
                    return jsonRpcError(body.id, -32602, 'get_post requires a non-empty slug argument');
                }

                const post = getPostBySlug(slug);

                if (!post) {
                    return jsonRpcError(body.id, -32602, `Post not found: ${slug}`);
                }

                return jsonRpcResult(body.id, {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(post, null, 2),
                        },
                    ],
                });
            }

            return jsonRpcError(body.id, -32601, `Unknown tool: ${toolName || 'missing tool name'}`);
        }

        case 'ping':
            return jsonRpcResult(body.id, {});

        default:
            return jsonRpcError(body.id, -32601, `Method not found: ${body.method || 'missing method'}`);
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: responseHeaders,
    });
}
