import { NextResponse } from 'next/server';
import { BLOG_CONTENT_SKILL, discoveryHeaders } from '@/lib/agentDiscovery';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'text/markdown; charset=utf-8',
};

export async function GET() {
    return new NextResponse(BLOG_CONTENT_SKILL, {
        headers: responseHeaders,
    });
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}

export async function OPTIONS() {
    return new NextResponse(null, { headers: responseHeaders });
}
