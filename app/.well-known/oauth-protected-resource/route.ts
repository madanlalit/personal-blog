import { NextResponse } from 'next/server';
import { discoveryHeaders } from '@/lib/agentDiscovery';

export const dynamic = 'force-static';

const responseHeaders = {
    ...discoveryHeaders,
    'Content-Type': 'application/json',
};

export async function GET() {
    return NextResponse.json(
        {
            resource: 'https://lalitmadan.com',
            authorization_servers: ['https://lalitmadan.com'],
            scopes_supported: ['read', 'write'],
        },
        { headers: responseHeaders }
    );
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
