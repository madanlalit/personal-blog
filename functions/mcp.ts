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
        let body: any;
        try {
            body = await request.json();
        } catch {
            return jsonRpcError(null, -32700, 'Parse error');
        }

        function jsonRpcResult(id: any, result: unknown) {
            return new Response(
                JSON.stringify({
                    jsonrpc: '2.0',
                    id: id ?? null,
                    result,
                }),
                { headers: responseHeaders }
            );
        }

        function jsonRpcError(id: any, code: number, message: string) {
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

                if (toolName === 'get_all_posts') {
                    try {
                        const postsUrl = new URL('/api/posts', request.url);
                        // Fetching static asset via local Pages ASSETS binding
                        const res = await (env as any).ASSETS.fetch(new Request(postsUrl));
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
                    } catch (err: any) {
                        return jsonRpcError(body.id, -32603, `Internal error fetching posts: ${err.message}`);
                    }
                }

                if (toolName === 'search_posts') {
                    const query = String(args.query ?? '').trim().toLowerCase();

                    if (!query) {
                        return jsonRpcError(body.id, -32602, 'search_posts requires a non-empty query argument');
                    }

                    try {
                        const postsUrl = new URL('/api/posts', request.url);
                        const res = await (env as any).ASSETS.fetch(new Request(postsUrl));
                        if (!res.ok) throw new Error('Failed to fetch posts from assets');
                        const posts: any[] = await res.json();

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
                    } catch (err: any) {
                        return jsonRpcError(body.id, -32603, `Internal error: ${err.message}`);
                    }
                }

                if (toolName === 'get_post') {
                    const slug = String(args.slug ?? '').trim();

                    if (!slug) {
                        return jsonRpcError(body.id, -32602, 'get_post requires a non-empty slug argument');
                    }

                    try {
                        const postUrl = new URL(`/api/post/${encodeURIComponent(slug)}`, request.url);
                        const res = await (env as any).ASSETS.fetch(new Request(postUrl));
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
                    } catch (err: any) {
                        return jsonRpcError(body.id, -32603, `Internal error: ${err.message}`);
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
