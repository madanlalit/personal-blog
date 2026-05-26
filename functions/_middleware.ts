interface Env {
    ASSETS: {
        fetch: (request: Request) => Promise<Response>;
    };
}

interface MiddlewareContext {
    request: Request;
    env: Env;
    next: () => Promise<Response>;
}

function acceptsMarkdown(request: Request): boolean {
    const accept = request.headers.get('accept')?.toLowerCase() ?? '';
    return accept.split(',').some((entry) => entry.trim().startsWith('text/markdown'));
}

function estimateMarkdownTokens(markdown: string): number {
    const tokenLikeParts = markdown.match(/[\w'.-]+|[^\s\w]/g);
    return tokenLikeParts?.length ?? 0;
}

export async function onRequest(context: MiddlewareContext): Promise<Response> {
    const { request, next, env } = context;

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        const response = await next();
        response.headers.append('Vary', 'Accept');
        return response;
    }

    if (!acceptsMarkdown(request)) {
        const response = await next();
        response.headers.append('Vary', 'Accept');
        return response;
    }

    const url = new URL(request.url);
    const { pathname } = url;

    let targetPath = '';

    if (pathname === '/' || pathname === '') {
        targetPath = '/markdown';
    } else {
        const postMatch = pathname.match(/^\/post\/([^/]+)\/?$/);
        if (postMatch) {
            targetPath = `/markdown-post/${postMatch[1]}`;
        }
    }

    if (targetPath) {
        try {
            // Fetch the static markdown asset from ASSETS
            const assetUrl = new URL(targetPath, request.url);
            const res = await env.ASSETS.fetch(new Request(assetUrl, {
                method: request.method,
                headers: request.headers,
            }));

            if (res.ok) {
                const markdownText = await res.text();
                return new Response(markdownText, {
                    status: res.status,
                    statusText: res.statusText,
                    headers: {
                        'Content-Type': 'text/markdown; charset=utf-8',
                        'Cache-Control': 'no-store',
                        'Vary': 'Accept',
                        'x-markdown-tokens': String(estimateMarkdownTokens(markdownText)),
                    },
                });
            }
        } catch (e: unknown) {
            console.error('Error fetching markdown asset:', e);
        }
    }

    const response = await next();
    response.headers.append('Vary', 'Accept');
    return response;
}
