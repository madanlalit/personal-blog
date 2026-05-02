function estimateMarkdownTokens(markdown: string): number {
    const tokenLikeParts = markdown.match(/[\w'.-]+|[^\s\w]/g);
    return tokenLikeParts?.length ?? 0;
}

export function markdownResponse(markdown: string): Response {
    return new Response(markdown, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'no-store',
            Vary: 'Accept',
            'x-markdown-tokens': String(estimateMarkdownTokens(markdown)),
        },
    });
}
