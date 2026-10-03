interface CloudflareEnv {
    ASSETS?: { fetch: (request: Request) => Promise<Response> };
    [key: string]: unknown;
}

interface JsonRpcRequest {
    jsonrpc?: string;
    id?: unknown;
    method?: string;
    params?: {
        name?: string;
        arguments?: Record<string, unknown>;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

interface BlogPostSummary {
    title?: string;
    seoTitle?: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    keywords?: string[];
    [key: string]: unknown;
}

export const onRequest: PagesFunction = async (context) => {
    const { request, env } = context;

    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: responseHeaders });
    }

    if (request.method === 'GET') {
        return new Response(
            JSON.stringify({
                name: 'lalitmadan-blog',
                description: 'Public MCP endpoint for discovering and reading Lalit Madan blog posts.',
                serverCard: '/.well-known/mcp/server-card.json',
            }),
            { headers: responseHeaders }
        );
    }

    if (request.method === 'POST') {
        let body: JsonRpcRequest;
        try {
            body = (await request.json()) as JsonRpcRequest;
        } catch {
            return jsonRpcError(null, -32700, 'Parse error');
        }

        function jsonRpcResult(id: unknown, result: unknown) {
            return new Response(
                JSON.stringify({
                    jsonrpc: '2.0',
                    id: id ?? null,
                    result,
                }),
                { headers: responseHeaders }
            );
        }

        function jsonRpcError(id: unknown, code: number, message: string) {
            return new Response(
                JSON.stringify({
                    jsonrpc: '2.0',
                    id: id ?? null,
                    error: {
                        code,
                        message,
                    },
                }),
                { headers: responseHeaders, status: code === -32601 ? 404 : 400 }
            );
        }

        const blogToolDefinitions = [
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
                const cloudflareEnv = env as CloudflareEnv;
                const assetsFetcher = cloudflareEnv.ASSETS;

                if (toolName === 'get_all_posts') {
                    try {
                        const postsUrl = new URL('/api/posts', request.url);
                        // Fetching static asset via local Pages ASSETS binding
                        if (!assetsFetcher) throw new Error('Failed to access ASSETS binding');
                        const res = await assetsFetcher.fetch(new Request(postsUrl));
                        if (!res.ok) throw new Error('Failed to fetch posts from assets');
                        const posts = await res.json();

                        return jsonRpcResult(body.id, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(posts, null, 2),
                                },
                            ],
                        });
                    } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : String(err);
                        return jsonRpcError(body.id, -32603, `Internal error fetching posts: ${message}`);
                    }
                }

                if (toolName === 'search_posts') {
                    const query = String(args.query ?? '').trim().toLowerCase();

                    if (!query) {
                        return jsonRpcError(body.id, -32602, 'search_posts requires a non-empty query argument');
                    }

                    try {
                        const postsUrl = new URL('/api/posts', request.url);
                        if (!assetsFetcher) throw new Error('Failed to access ASSETS binding');
                        const res = await assetsFetcher.fetch(new Request(postsUrl));
                        if (!res.ok) throw new Error('Failed to fetch posts from assets');
                        const posts = (await res.json()) as BlogPostSummary[];

                        const filtered = posts.filter((post) => {
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

                            return searchableText.includes(query);
                        });

                        return jsonRpcResult(body.id, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(filtered, null, 2),
                                },
                            ],
                        });
                    } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : String(err);
                        return jsonRpcError(body.id, -32603, `Internal error: ${message}`);
                    }
                }

                if (toolName === 'get_post') {
                    const slug = String(args.slug ?? '').trim();

                    if (!slug) {
                        return jsonRpcError(body.id, -32602, 'get_post requires a non-empty slug argument');
                    }

                    try {
                        const postUrl = new URL(`/api/post/${encodeURIComponent(slug)}`, request.url);
                        if (!assetsFetcher) throw new Error('Failed to access ASSETS binding');
                        const res = await assetsFetcher.fetch(new Request(postUrl));
                        if (!res.ok) {
                            return jsonRpcError(body.id, -32602, `Post not found: ${slug}`);
                        }
                        const post = await res.json();

                        return jsonRpcResult(body.id, {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(post, null, 2),
                                },
                            ],
                        });
                    } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : String(err);
                        return jsonRpcError(body.id, -32603, `Internal error: ${message}`);
                    }
                }

                return jsonRpcError(body.id, -32601, `Unknown tool: ${toolName || 'missing tool name'}`);
            }

            case 'ping':
                return jsonRpcResult(body.id, {});

            default:
                return jsonRpcError(body.id, -32601, `Method not found: ${body.method || 'missing method'}`);
        }
    }

    return new Response(null, { status: 405 });
};
