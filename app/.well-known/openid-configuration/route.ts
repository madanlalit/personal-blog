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
            issuer: 'https://lalitmadan.com',
            authorization_endpoint: 'https://lalitmadan.com/oauth/authorize',
            token_endpoint: 'https://lalitmadan.com/oauth/token',
            jwks_uri: 'https://lalitmadan.com/oauth/jwks',
            grant_types_supported: ['authorization_code', 'client_credentials'],
            response_types_supported: ['code'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
        },
        { headers: responseHeaders }
    );
}

export async function HEAD() {
    return new NextResponse(null, { headers: responseHeaders });
}
