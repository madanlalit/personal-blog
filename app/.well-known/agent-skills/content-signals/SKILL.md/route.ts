import { NextResponse } from 'next/server';
import { CONTENT_SIGNALS_SKILL, discoveryHeaders } from '@/lib/agentDiscovery';

export const dynamic = 'force-static';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'text/markdown; charset=utf-8',
};

export async function GET() {
    return new NextResponse(CONTENT_SIGNALS_SKILL, {
        headers: responseHeaders,
    });
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
