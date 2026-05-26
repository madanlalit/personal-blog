import { NextResponse } from 'next/server';
import {
    BLOG_CONTENT_SKILL,
    MARKDOWN_NEGOTIATION_SKILL,
    CONTENT_SIGNALS_SKILL,
    OAUTH_DISCOVERY_SKILL,
    OAUTH_PROTECTED_RESOURCE_SKILL,
    discoveryHeaders,
    sha256Digest
} from '@/lib/agentDiscovery';

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
                {
                    name: 'content-signals',
                    type: 'skill-md',
                    description: 'Declare AI content usage preferences in your robots.txt using Content Signals.',
                    url: '/.well-known/agent-skills/content-signals/SKILL.md',
                    digest: sha256Digest(CONTENT_SIGNALS_SKILL),
                },
                {
                    name: 'oauth-discovery',
                    type: 'skill-md',
                    description: 'Publish OAuth or OpenID Connect discovery metadata so agents can authenticate with your APIs.',
                    url: '/.well-known/agent-skills/oauth-discovery/SKILL.md',
                    digest: sha256Digest(OAUTH_DISCOVERY_SKILL),
                },
                {
                    name: 'oauth-protected-resource',
                    type: 'skill-md',
                    description: 'Publish OAuth Protected Resource Metadata so agents can discover how to authenticate per RFC 9728.',
                    url: '/.well-known/agent-skills/oauth-protected-resource/SKILL.md',
                    digest: sha256Digest(OAUTH_PROTECTED_RESOURCE_SKILL),
                },
            ],
        },
        { headers: responseHeaders }
    );
}


export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
