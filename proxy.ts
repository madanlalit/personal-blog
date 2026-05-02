import { NextResponse, type NextRequest } from 'next/server';

function acceptsMarkdown(request: NextRequest): boolean {
    const accept = request.headers.get('accept')?.toLowerCase() ?? '';
    return accept.split(',').some((entry) => entry.trim().startsWith('text/markdown'));
}

export function proxy(request: NextRequest) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return withAcceptVary(NextResponse.next());
    }

    if (!acceptsMarkdown(request)) {
        return withAcceptVary(NextResponse.next());
    }

    const url = request.nextUrl.clone();
    const { pathname } = url;

    if (pathname === '/') {
        url.pathname = '/markdown';
        return NextResponse.rewrite(url);
    }

    const postMatch = pathname.match(/^\/post\/([^/]+)$/);
    if (postMatch) {
        url.pathname = `/markdown/post/${postMatch[1]}`;
        return NextResponse.rewrite(url);
    }

    return withAcceptVary(NextResponse.next());
}

function withAcceptVary(response: NextResponse): NextResponse {
    response.headers.append('Vary', 'Accept');
    return response;
}

export const config = {
    matcher: ['/', '/post/:slug'],
};
