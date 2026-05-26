import { NextResponse } from 'next/server';
import { BLOG_CONTENT_SKILL, MARKDOWN_NEGOTIATION_SKILL, discoveryHeaders, sha256Digest } from '@/lib/agentDiscovery';

export const dynamic = 'force-static';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'application/json',
};

export async function GET() {
    return NextResponse.json(
        {
            $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
            skills: [
                {
                    name: 'blog-content',
                    type: 'skill-md',
                    description: 'Discover, search, cite, and summarize Lalit Madan public blog posts about AI agents, context engineering, SKILL.md, AGENTS.md, and developer workflows.',
                    url: '/.well-known/agent-skills/blog-content/SKILL.md',
                    digest: sha256Digest(BLOG_CONTENT_SKILL),
                },
                {
                    name: 'markdown-negotiation',
                    type: 'skill-md',
                    description: 'Support `Accept: text/markdown` content negotiation so agents can request markdown versions of your pages.',
                    url: '/.well-known/agent-skills/markdown-negotiation/SKILL.md',
                    digest: sha256Digest(MARKDOWN_NEGOTIATION_SKILL),
                },
            ],
        },
        { headers: responseHeaders }
    );
}


export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
