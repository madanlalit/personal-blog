import { NextResponse } from 'next/server';
import { OAUTH_PROTECTED_RESOURCE_SKILL, discoveryHeaders } from '@/lib/agentDiscovery';

export const dynamic = 'force-static';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'text/markdown; charset=utf-8',
};

export async function GET() {
    return new NextResponse(OAUTH_PROTECTED_RESOURCE_SKILL, {
        headers: responseHeaders,
    });
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
