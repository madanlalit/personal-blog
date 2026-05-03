import { NextResponse } from 'next/server';

import { SITE_CONFIG } from '@/lib/config';

const apiCatalog = {
    linkset: [
        {
            anchor: `${SITE_CONFIG.url}/.well-known/api-catalog`,
            item: [
                {
                    href: `${SITE_CONFIG.url}/api/posts`,
                    type: 'application/json',
                    title: 'Blog posts index',
                },
                {
                    href: `${SITE_CONFIG.url}/api/posts/{slug}`,
                    type: 'application/json',
                    title: 'Blog post by slug',
                },
                {
                    href: `${SITE_CONFIG.url}/mcp`,
                    type: 'application/json',
                    title: 'Public MCP endpoint',
                },
                {
                    href: `${SITE_CONFIG.url}/.well-known/mcp/server-card.json`,
                    type: 'application/json',
                    title: 'MCP server card',
                },
                {
                    href: `${SITE_CONFIG.url}/.well-known/agent-skills/index.json`,
                    type: 'application/json',
                    title: 'Agent skills discovery index',
                },
            ],
        },
    ],
};

const responseHeaders = {
    'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    Link: `<${SITE_CONFIG.url}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET() {
    return NextResponse.json(apiCatalog, {
        headers: responseHeaders,
    });
}

export async function HEAD() {
    return new NextResponse(null, {
        headers: responseHeaders,
    });
}
