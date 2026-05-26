import { NextResponse } from 'next/server';
import { discoveryHeaders, mcpServerCard } from '@/lib/agentDiscovery';

export const dynamic = 'force-static';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'application/json',
};

export async function GET() {
    return NextResponse.json(mcpServerCard, {
        headers: responseHeaders,
    });
}

export async function HEAD() {
    return new NextResponse(null, {
        headers: responseHeaders,
    });
}
