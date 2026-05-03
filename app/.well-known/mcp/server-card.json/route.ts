import { NextResponse } from 'next/server';
import { discoveryHeaders, mcpServerCard } from '@/lib/agentDiscovery';

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

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: responseHeaders,
    });
}
