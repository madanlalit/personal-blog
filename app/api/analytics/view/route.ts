import { NextRequest, NextResponse } from 'next/server';
import { recordPageView } from '@/lib/analytics';

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.path !== 'string') {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || 'unknown';
    const country = req.headers.get('x-vercel-ip-country') || '';
    const region = req.headers.get('x-vercel-ip-country-region') || '';
    const city = req.headers.get('x-vercel-ip-city') || '';

    await recordPageView({
        path: body.path,
        prevPath: typeof body.prevPath === 'string' ? body.prevPath : '',
        referrer: typeof body.referrer === 'string' ? body.referrer : '',
        userAgent,
        timestamp: Date.now(),
        isNewSession: typeof body.isNewSession === 'boolean' ? body.isNewSession : false,
        isNewVisitor: typeof body.isNewVisitor === 'boolean' ? body.isNewVisitor : false,
        isReturningSession: typeof body.isReturningSession === 'boolean' ? body.isReturningSession : false,
        country,
        region,
        city,
        utmSource: typeof body.utmSource === 'string' ? body.utmSource : '',
        utmMedium: typeof body.utmMedium === 'string' ? body.utmMedium : '',
        utmCampaign: typeof body.utmCampaign === 'string' ? body.utmCampaign : '',
        utmTerm: typeof body.utmTerm === 'string' ? body.utmTerm : '',
        utmContent: typeof body.utmContent === 'string' ? body.utmContent : '',
    });

    return NextResponse.json({ ok: true }, {
        headers: { 'Cache-Control': 'no-store' },
    });
}
