import { NextResponse } from 'next/server';
import { MARKDOWN_NEGOTIATION_SKILL, discoveryHeaders } from '@/lib/agentDiscovery';

export const dynamic = 'force-static';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'text/markdown; charset=utf-8',
};

export async function GET() {
    return new NextResponse(MARKDOWN_NEGOTIATION_SKILL, {
        headers: responseHeaders,
    });
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
