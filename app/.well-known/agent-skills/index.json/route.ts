import { NextResponse } from 'next/server';
import { BLOG_CONTENT_SKILL, discoveryHeaders, sha256Digest } from '@/lib/agentDiscovery';

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
            ],
        },
        { headers: responseHeaders }
    );
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}

export async function OPTIONS() {
    return new NextResponse(null, { headers: responseHeaders });
}
